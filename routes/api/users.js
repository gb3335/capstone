const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const generator = require("generate-password");
const uuid = require("uuid");
//Load input Validation
const download = require("download-pdf");
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const rimraf = require("rimraf");

// Backup and Restore
const backup = require("mongodb-backup");
var restore = require("mongodb-restore");

const AWS = require("aws-sdk");
const s3config = require("../../config/s3keys");
AWS.config.update({
  accessKeyId: s3config.iamUser,
  secretAccessKey: s3config.iamSecret,
  region: "us-east-2"
});

const validateRegisterInput = require("../../validation/register");
const validateProfileInput = require("../../validation/profile");
const validateLoginInput = require("../../validation/login");
const validatePasswordInput = require("../../validation/password");
const validateuserNameInput = require("../../validation/profileusername");
const validateForgotInput = require("../../validation/forgot");
let pdfUsersTemplate;
let pdfUserTemplate;
let fontFooter;
pdfUsersTemplate = require("../../document/usersTemplate");
pdfUserTemplate = require("../../document/userTemplate");
fontFooter = "7px";
// Load User Model
const User = require("../../models/User");
// Load UserLog Model
const UserLog = require("../../models/UserLog");
// Load Transport Email
const Transporter = require("../../mailer/transporter");
// Load Activity Model
const Activity = require("../../models/Activity");
// Load Backup Model
const BackupModel = require("../../models/Backup");

// mongoURI
const mongoConfig = require("../../config/keys");

// @routes  GET api/users/test
// @desc    Test users route
// @access  public
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works!" });
});

generatePassword = () => {
  return (password = generator.generate({
    length: 10,
    numbers: true
  }));
};

// @routes  POST api/users/profile/update-password
// @desc    Edit User password
// @access  private
router.post(
  "/profile/update-password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePasswordInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileData = {
      password: req.body.newpassword
    };

    User.findById(req.user._id).then(user => {
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if (isMatch) {
          bcrypt.compare(req.body.newpassword, user.password).then(isMatch => {
            if (isMatch) {
              errors.newpassword = "Please enter a new password!";
              return res.status(400).json(errors);
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(profileData.password, salt, (err, hash) => {
                  if (err) throw err;
                  profileData.password = hash;

                  const newActivity = {
                    title:
                      "User " +
                      (user.userName ? user.userName : user.email) +
                      " updated",
                    by: user._id,
                    type: "User"
                  };
                  new Activity(newActivity).save();

                  User.findByIdAndUpdate(
                    req.user._id,
                    { $set: profileData },
                    { new: true }
                  )
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
              });
            }
          });
        } else {
          errors.password = "Old Password do not match!";
          return res.status(400).json(errors);
        }
      });
    });
  }
);

// @routes  POST api/users/profile/update
// @desc    Edit User profile
// @access  private
router.post(
  "/profile/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const password = req.body.password;

    const profileData = {
      name: {
        firstName: req.body.firstname,
        middleName: req.body.middlename,
        lastName: req.body.lastname
      },
      email: req.body.email,
      contact: req.body.contact,
      college: req.body.college,
      id: req.body.id
    };
    User.findOne({ email: profileData.email }).then(user => {
      const errors = {};
      if (user) {
        if (user.email != req.user.email) {
          errors.email = "Email Already Exists!";
          return res.status(400).json(errors);
        } else {
          const newActivity = {
            title:
              "User " +
              (user.userName ? user.userName : user.email) +
              " updated",
            by: user._id,
            type: "User"
          };
          new Activity(newActivity).save();

          User.findByIdAndUpdate(
            req.user._id,
            { $set: profileData },
            { new: true }
          ).then(user => {
            const payload = {
              id: user._id,
              userName: user.userName,
              email: user.email,
              contact: user.contact,
              name: {
                firstName: user.name.firstName,
                middleName: user.name.middleName,
                lastName: user.name.lastName
              },
              avatar: user.avatar,
              userType: user.userType,
              isLock: user.isLock,
              isBlock: user.isBlock,
              invitedBy: user.invitedBy,
              college: user.college,
              date: user.date
            };
            jwt.sign(payload, keys.secretOrKey, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            });
          });
        }
      }
    });
  }
);
// @routes  POST api/users/profile/updateusername
// @desc    Edit User profile username
// @access  private
router.post(
  "/profile/updateusername",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateuserNameInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileData = {
      userName: req.body.userName
    };
    User.findOne({ _id: req.body.id }).then(user => {
      if (user) {
        if (user.userName != req.user.userName) {
          errors.userName = "Username Already Exists!";
          return res.status(400).json(errors);
        } else {
          const newActivity = {
            title:
              "User " +
              (user.userName ? user.userName : user.email) +
              ": Username updated to " +
              profileData.userName,
            by: user._id,
            type: "User"
          };
          new Activity(newActivity).save();
          User.findByIdAndUpdate(
            req.user._id,
            { $set: profileData },
            { new: true }
          ).then(user => {
            const payload = {
              id: user._id,
              userName: user.userName,
              email: user.email,
              contact: user.contact,
              name: {
                firstName: user.name.firstName,
                middleName: user.name.middleName,
                lastName: user.name.lastName
              },
              avatar: user.avatar,
              userType: user.userType,
              isLock: user.isLock,
              isBlock: user.isBlock,
              invitedBy: user.invitedBy,
              college: user.college,
              date: user.date
            };
            jwt.sign(payload, keys.secretOrKey, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            });
          });
        }
      }
    });
  }
);

// @routes  POST api/users/profile/updateusername
// @desc    Edit User profile username
// @access  private
router.post(
  "/profile/addby",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileData = {
      invitedBy: req.body.invitedBy
    };
    User.findOne({ _id: req.body.id }).then(user => {
      if (user) {
        User.findByIdAndUpdate(
          req.user._id,
          { $set: profileData },
          { new: true }
        ).then(user => {
          res.json({
            success: true
          });
        });
      }
    });
  }
);

// @routes  POST api/users/profile/updatepassword
// @desc    Edit User profile
// @access  private
router.post(
  "/profile/updatepassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePasswordInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const password = req.body.newpassword;
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    const profileData = {
      id: req.body.id,
      password,
      passwordUpdated: 1
    };

    User.findById(req.user._id).then(user => {
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if (isMatch) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(profileData.password, salt, (err, hash) => {
              if (err) throw err;
              profileData.password = hash;

              const newActivity = {
                title:
                  "User " +
                  (user.userName ? user.userName : user.email) +
                  ": Password updated",
                by: user._id,
                type: "User"
              };
              new Activity(newActivity).save();

              User.findByIdAndUpdate(
                req.user._id,
                { $set: profileData },
                { new: true }
              )
                .then(user => {
                  const payload = {
                    id: user._id,
                    userName: user.userName,
                    email: user.email,
                    contact: user.contact,
                    name: {
                      firstName: user.name.firstName,
                      middleName: user.name.middleName,
                      lastName: user.name.lastName
                    },
                    avatar: user.avatar,
                    userType: user.userType,
                    isLock: user.isLock,
                    isBlock: user.isBlock,
                    invitedBy: user.invitedBy,
                    college: user.college,
                    passwordUpdated: user.passwordUpdated,
                    date: user.date
                  };
                  jwt.sign(payload, keys.secretOrKey, (err, token) => {
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  });
                })
                .catch(err => console.log(err));
            });
          });
        } else {
          errors.password = "Invalid password";
          return res.status(400).json(errors);
        }
      });
    });

    // User.findOne({ email: profileData.email }).then(user => {
    //   const errors = {}
    //   if (user) {
    //     if (user.email != req.user.email) {
    //       errors.email = "Email Already Exists!";
    //       return res.status(400).json(errors);
    //     }
    //   }
    //   User.findOne({ userName: profileData.userName }).then(user => {

    //     if (user) {
    //       if (user.userName != req.user.userName) {
    //         errors.userName = "Username Already Exists!";
    //         return res.status(400).json(errors);
    //       }
    //     }

    //     bcrypt.genSalt(10, (err, salt) => {
    //       bcrypt.hash(profileData.password, salt, (err, hash) => {
    //         if (err) throw err;
    //         profileData.password = hash;
    //         User.findByIdAndUpdate(
    //           req.user._id,
    //           { $set: profileData },
    //           { new: true }
    //         ).then(user => res.json(user));
    //       });
    //     });
    //   })
    // });
  }
);

// @routes  POST api/users/profile/changestatus
// @desc    Edit User profile
// @access  private
router.post(
  "/profile/changestatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const isBlock = req.body.isBlock;
    const profileData = {
      id: req.body.id,
      isBlock
    };
    User.findById(req.user._id).then(user => {
      if (profileData.isBlock == 0) {
        profileData.isBlock = 1;
        const newActivity = {
          title:
            "User " +
            (user.username ? user.username : user.email) +
            ": User deactivated",
          by: req.body.loginid,
          type: "User"
        };
        new Activity(newActivity).save();
        User.findByIdAndUpdate(
          req.body.id,
          { $set: profileData },
          { new: true }
        )
          .then(user => res.json(user))
          .catch(err => console.log(err));
      } else {
        profileData.isBlock = 0;
        const newActivity = {
          title:
            "User " +
            (user.username ? user.username : user.email) +
            ": User change status to active",
          by: req.body.loginid,
          type: "User"
        };
        new Activity(newActivity).save();
        User.findByIdAndUpdate(
          req.body.id,
          { $set: profileData },
          { new: true }
        )
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }
    });
  }
);

// @routes  POST api/users/forgotpassword
// @desc    Forgot password/
// @access  private
router.post(
  "/forgotpassword",

  (req, res) => {
    const { errors, isValid } = validateForgotInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          const password = generatePassword();
          const mailOptions = {
            from: "Bulacan State University <dummykrishield@gmail.com>",
            to: req.body.email,
            subject: "Password Reset",
            text: `<p>Here is your new password generated by the system.</p> 
                
                <ul>
                  <li>Login to: http://34.229.6.94/login</li>
                  <li>Email: ${req.body.email}</li>
                  <li>Password: ${password}</li>
                </ul>
                `
          };
          Transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              errors.sendemail = "Sending Email Failed!";
              return res.status(400).json(errors);
            } else {
              success.sendemail = "Invitation Successfully Sent!";
            }
          });

          const newUser = {
            passwordUpdated: 0,
            password
          };

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              User.findByIdAndUpdate(user._id, { $set: newUser }, { new: true })
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
        } else {
          errors.email = "Email do not exist.";
          return res.status(400).json(errors);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @routes  POST api/users/register
// @desc    Add / Update User
// @access  private
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = "Email Already Exists!";
        return res.status(400).json(errors);
      } else {
        const newActivity = {
          title: "User " + req.body.email + ": User created",
          by: req.body.createdBy,
          type: "User"
        };
        new Activity(newActivity).save();

        const password = generatePassword();

        const newUser = new User({
          name: {
            firstName: req.body.firstname,
            middleName: req.body.middlename,
            lastName: req.body.lastname
          },
          email: req.body.email,
          password,
          avatar: "/images/User.png",
          contact: req.body.contact,
          userType: req.body.usertype,
          college: req.body.college,
          invitedBy: req.user._id
        });
        let text = `<h3>Hi! ${req.body.firstname} ${req.body.lastname}</h3>
        
          <p>You are invited to be a <strong>${
          req.body.usertype 
        }</strong> in Bulacan State University Research Admin Office by ${req.user.name.firstName} ${
          req.user.name.lastName
        }</p>
              <ul>
                <li>Login to: http://34.229.6.94/login</li>
                <li>Email: ${req.body.email}</li>
                <li>Password: ${password}</li>
              </ul>
              
              `

        if(req.body.usertype.toString().toLowerCase()==="administrator"){
          text = `<h3>Hi! ${req.body.firstname} ${req.body.lastname}</h3>
        
          <p>You are invited to be an <strong>${
          req.body.usertype 
        }</strong> in Bulacan State University Research Admin Office by ${req.user.name.firstName} ${
          req.user.name.lastName
        }</p>
              <ul>
                <li>Login to: http://34.229.6.94/login</li>
                <li>Email: ${req.body.email}</li>
                <li>Password: ${password}</li>
              </ul>
              
              `
        }

        const mailOptions = {
          from: "Bulacan State University <dummykrishield@gmail.com>",
          to: req.body.email,
          subject: "Invitation",
          html: text
        };
        Transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            errors.sendemail = "Sending Email Failed!";
            return res.status(400).json(errors);
          } else {
            success.sendemail = "Invitation Successfully Sent!";
          }
        });

        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
);
router.post("/logout", (req, res) => {
  const newUser = new UserLog({
    name: {
      firstName: req.body.name.firstName,
      middleName: req.body.name.middleName,
      lastName: req.body.name.lastName
    },
    email: req.body.email,
    avatar: req.body.avatar,
    isBlock: req.body.isBlock,
    userType: req.body.userType,
    college: req.body.college,
    contact: req.body.contact,
    by: req.body.by,
    type: "Logout"
  });

  newUser.save().catch(err => console.log(err));
});
// @routes  POST api/users/login
// @desc    Login User /Returning JWT Token
// @access  public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userName = req.body.username;
  const password = req.body.password;

  //FIND THE USER BY USERNAME
  User.findOne({ userName }).then(user => {
    //Check for User
    if (!user) {
      User.findOne({ email: userName }).then(user => {
        if (!user) {
          errors.username = "User not found!";
          return res.status(404).json(errors);
        } else {
          if (user.isBlock === 0) {
            //Check password
            bcrypt.compare(password, user.password).then(isMatch => {
              if (isMatch) {
                //User Match!

                const payload = {
                  id: user._id,
                  userName: user.userName,
                  email: user.email,
                  contact: user.contact,
                  name: {
                    firstName: user.name.firstName,
                    middleName: user.name.middleName,
                    lastName: user.name.lastName
                  },
                  avatar: user.avatar,
                  userType: user.userType,
                  isLock: user.isLock,
                  isBlock: user.isBlock,
                  invitedBy: user.invitedBy,
                  college: user.college,
                  passwordUpdated: user.passwordUpdated,
                  date: user.date
                };

                const newUser = new UserLog({
                  by: user._id,
                  name: {
                    firstName: user.name.firstName,
                    middleName: user.name.middleName,
                    lastName: user.name.lastName
                  },
                  email: user.email,
                  avatar: user.avatar,
                  isBlock: user.isBlock,
                  userType: user.userType,
                  college: user.college,
                  contact: user.contact,
                  type: "Login"
                });

                newUser.save().catch(err => console.log(err));

                //Create JWT Payload
                //Sign the Token
                jwt.sign(payload, keys.secretOrKey, (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                });
              } else {
                errors.password = "Password Incorrect!";
                return res.status(400).json(errors);
              }
            });
          } else {
            errors.username =
              "User currently blocked. Please contact the administrator!";
            return res.status(400).json(errors);
          }
        }
      });
    } else {
      if (user.isBlock === 0) {
        //Check password
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            //User Match!

            const payload = {
              id: user._id,
              userName: user.userName,
              email: user.email,
              contact: user.contact,
              name: {
                firstName: user.name.firstName,
                middleName: user.name.middleName,
                lastName: user.name.lastName
              },
              avatar: user.avatar,
              userType: user.userType,
              isLock: user.isLock,
              isBlock: user.isBlock,
              invitedBy: user.invitedBy,
              college: user.college,
              date: user.date,
              passwordUpdated: user.passwordUpdated
            };

            const newUser = new UserLog({
              by: user._id,
              name: {
                firstName: user.name.firstName,
                middleName: user.name.middleName,
                lastName: user.name.lastName
              },
              email: user.email,
              avatar: user.avatar,
              isBlock: user.isBlock,
              userType: user.userType,
              college: user.college,
              contact: user.contact,
              type: "Login"
            });

            newUser.save().catch(err => console.log(err));

            //Create JWT Payload
            //Sign the Token
            jwt.sign(payload, keys.secretOrKey, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            });
          } else {
            errors.password = "Password Incorrect!";
            return res.status(400).json(errors);
          }
        });
      } else {
        errors.username =
          "User currently blocked. Please contact the administrator!";
        return res.status(400).json(errors);
      }
    }
  });
});

// @routes  GET api/users/current
// @desc    Return Current User
// @access  private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      userName: req.user.userName,
      email: req.user.email,
      contact: req.user.contact,
      firstName: req.user.name.firstName,
      middleName: req.user.name.middleName,
      lastName: req.user.name.lastName,
      avatar: req.user.avatar,
      userType: req.user.userType,
      isLock: req.user.isLock,
      isBlock: req.user.isBlock,
      invitedBy: req.user.invitedBy,
      college: req.user.college,
      date: req.user.date
    });
  }
);

// @route   GET api/users/
// @desc    Get activities
// @access  Public
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .sort({ date: -1 })
      .then(user => {
        const payload = [];
        const list = user;
        list.map((currentElement, index) => {
          payload.push({
            _id: currentElement._id,
            userName: currentElement.userName,
            email: currentElement.email,
            contact: currentElement.contact,
            name: {
              firstName: currentElement.name.firstName,
              middleName: currentElement.name.middleName,
              lastName: currentElement.name.lastName
            },
            avatar: currentElement.avatar,
            userType: currentElement.userType,
            isLock: currentElement.isLock,
            isBlock: currentElement.isBlock,
            invitedBy: currentElement.invitedBy,
            college: currentElement.college,
            date: currentElement.date
          });
        });
        res.json(payload);
      });
  }
);

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Public
router.get("/:id", (req, res) => {
  const errors = {};
  User.findOne({ _id: req.params.id })
    .populate("user", ["name", "avatar"])
    .then(user => {
      if (!user) {
        errors.nouser = "There is no data for this research";
        res.status(404).json(errors);
      }
      const payload = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        contact: user.contact,
        name: {
          firstName: user.name.firstName,
          middleName: user.name.middleName,
          lastName: user.name.lastName
        },
        avatar: user.avatar,
        userType: user.userType,
        isLock: user.isLock,
        isBlock: user.isBlock,
        invitedBy: user.invitedBy,
        college: user.college,
        date: user.date
      };

      res.json(payload);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/users/avatar
// @desc    add avatar to user
// @access  Private
router.post(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rand = uuid();
    if (req.body.oldFile !== "/images/User.png") {
      // delete journal document from s3
      let s3 = new AWS.S3();
      let params = {
        Bucket: "bulsu-capstone",
        Key: `userImages/${req.body.oldFile}`
      };
      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      });
      console.log("Old avatar deleted");
    }
    s3 = new AWS.S3();
    const base64Data = new Buffer(
      req.body.images[0].replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = req.body.images[0].split(";")[0].split("/")[1];
    const userId = 1;
    params = {
      Bucket: "bulsu-capstone",
      Key: `userImages/${req.body.id + "-" + rand}.png`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `image/${type}` // required. Notice the back ticks
    };
    s3.upload(params, (err, data) => {
      if (err) {
        return console.log(err);
      }
      console.log("Image successfully uploaded.");
      newUser = {
        avatar: req.body.id + "-" + rand + ".png"
      };

      const newActivity = {
        title: "User " + req.body.username + ": Avatar updated",
        by: req.body.id,
        type: "User"
      };
      new Activity(newActivity).save();

      User.findOneAndUpdate(
        { _id: req.body.id },
        { $set: newUser },
        { new: true }
      )
        .then(user =>
          res.json({ username: user.userName ? user.userName : user.email })
        )
        .catch(err => console.log(res.json(err)));
    });
  }
);

router.post(
  "/avatarupdateauth",

  (req, res) => {
    const userName = req.body.username;
    console.log(req.body.username);

    //FIND THE USER BY USERNAME
    User.findOne({ userName }).then(user => {
      //Check for User
      if (!user) {
        User.findOne({ email: userName }).then(user => {
          if (!user) {
            errors.username = "User not found!";
            return res.status(404).json(errors);
          } else {
            if (user.isBlock === 0) {
              const payload = {
                id: user._id,
                userName: user.userName,
                email: user.email,
                contact: user.contact,
                name: {
                  firstName: user.name.firstName,
                  middleName: user.name.middleName,
                  lastName: user.name.lastName
                },
                avatar: user.avatar,
                userType: user.userType,
                isLock: user.isLock,
                isBlock: user.isBlock,
                invitedBy: user.invitedBy,
                college: user.college,
                passwordUpdated: user.passwordUpdated,
                date: user.date
              }; //Create JWT Payload
              //Sign the Token
              jwt.sign(payload, keys.secretOrKey, (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              });
            } else {
              errors.username =
                "User currently blocked. Please contact the administrator!";
              return res.status(400).json(errors);
            }
          }
        });
      } else {
        if (user.isBlock === 0) {
          const payload = {
            id: user._id,
            userName: user.userName,
            email: user.email,
            contact: user.contact,
            name: {
              firstName: user.name.firstName,
              middleName: user.name.middleName,
              lastName: user.name.lastName
            },
            avatar: user.avatar,
            userType: user.userType,
            isLock: user.isLock,
            isBlock: user.isBlock,
            invitedBy: user.invitedBy,
            college: user.college,
            date: user.date
          }; //Create JWT Payload

          //Sign the Token
          jwt.sign(payload, keys.secretOrKey, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          errors.username =
            "User currently blocked. Please contact the administrator!";
          return res.status(400).json(errors);
        }
      }
    });
  }
);

// @route   POST api/journals/createReport/journals
// @desc    Generate List of all journals Report
// @access  Private
router.post(
  "/createReport/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const printedBy = req.body.printedBy;
    const options = {
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in"
      },
      paginationOffset: 1, // Override the initial pagination number
      footer: {
        height: "28mm",
        contents: {
          default: `<div class="item5">
          <p style="float: left; font-size: ${fontFooter}"><b>Printed By: </b>${printedBy}</p>
          <p style="float: right; font-size: ${fontFooter}">Page {{page}} of {{pages}}</p>
        </div>` // fallback value
        }
      }
    };
    pdf
      .create(pdfUsersTemplate(req.body), options)
      .toFile("usersPDF.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/journals/fetchReport/journals
// @desc    Send the generated pdf to client - list of journals
// @access  Private
router.get(
  "/fetchReport/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/usersPDF.pdf`, () => {
      fs.unlink(`${reqPath}/usersPDF.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

// @route   POST api/journals/createReport/journals
// @desc    Generate List of all journals Report
// @access  Private
router.post(
  "/createReport/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const printedBy = req.body.printedBy;
    const options = {
      border: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in"
      },
      paginationOffset: 1, // Override the initial pagination number
      footer: {
        height: "28mm",
        contents: {
          default: `<div class="item5">
          <p style="float: left; font-size: ${fontFooter}"><b>Printed By: </b>${printedBy}</p>
          <p style="float: right; font-size: ${fontFooter}">Page {{page}} of {{pages}}</p>
        </div>` // fallback value
        }
      }
    };
    pdf
      .create(pdfUserTemplate(req.body), options)
      .toFile("usersPDF.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/journals/fetchReport/journals
// @desc    Send the generated pdf to client - list of journals
// @access  Private
router.get(
  "/fetchReport/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/usersPDF.pdf`, () => {
      fs.unlink(`${reqPath}/usersPDF.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

// @route   GET api/users/getbackups
// @desc    Get Backups mongodb
// @access  Private
router.get(
  "/backups/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    BackupModel.find()
      .sort({ date: -1 })
      .then(backups => res.json(backups))
      .catch(err =>
        res.status(404).json({ noBackupsFound: "No Backups found" })
      );
  }
);

// @route   GET api/users/mongdb-backup
// @desc    Backup mongodb
// @access  Private
router.post(
  "/mongodb-backup",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const date = Date.now();
    const errors = {};
    if (req.body.title.length <= 0) {
      errors.title = "Backup Name is Required";
      return res.status(400).json(errors);
    }

    const newBackup = {
      title: req.body.title,
      folder: date,
      by: req.body.userId
    };
    backup(
      {
        uri: mongoConfig.mongoURI, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
        root: path.join(__dirname, `../../backups/${date}`)
      },
      new BackupModel(newBackup)
        .save()
        .then(backup => res.json({ backup, "errors.success": true }))
    );
  }
);

// @route   GET api/users/mongdb-restore
// @desc    Restore mongodb
// @access  Private
router.post(
  "/mongodb-restore",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    restore(
      {
        uri: "mongodb://carl:carl123@ds159993.mlab.com:59993/plagdb", // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
        root: path.join(__dirname, `../../backups/${req.body.folder}/capstone`)
      },
      res.json({ success: true })
    );
  }
);

// @route   GET api/users/delete-backup
// @desc    delete backup
// @access  Private
router.post(
  "/delete-backup",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pathDel = path.join(__dirname, `../../backups/${req.body.folder}`);

    rimraf(pathDel, function() {
      BackupModel.findOneAndDelete({ _id: req.body.id }).then(res =>
        res.json({ res })
      );
    });
  }
);

module.exports = router;
