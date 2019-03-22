const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const generator = require("generate-password");
const uuid = require("uuid");
//Load input Validation






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
const validatepasswordInput = require("../../validation/profilepassword");
// Load User Model
const User = require("../../models/User");

// Load Transport Email
const Transporter = require("../../mailer/transporter");

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

// @routes  POST api/users/profile/update-picture
// @desc    Change Profile Picture
// @access  private
router.post(
  "/profile/update-picture",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newAvatarPath = req.body.avatar;
    const profileData = {
      avatar: newAvatarPath
    };

    User.findByIdAndUpdate(req.user._id, { $set: profileData }, { new: true })
      .then(user => res.json(user))
      .catch(err => console.log(err));
  }
);

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
      id: req.body.id,

    };
    User.findOne({ email: profileData.email }).then(user => {
      const errors = {}
      if (user) {
        if (user.email != req.user.email) {
          errors.email = "Email Already Exists!";
          return res.status(400).json(errors);
        }
        User.findByIdAndUpdate(
          req.user._id,
          { $set: profileData },
          { new: true }
        ).then(user => res.json(user));

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
    const password = req.body.password;

    const profileData = {
      name: {
        firstName: req.body.firstname,
        middleName: req.body.middlename,
        lastName: req.body.lastname
      },
      email: req.body.email,
      userName: req.body.userName,
      contact: req.body.contact,
      college: req.body.college,
      id: req.body.id,
      password,
    };
    User.findOne({ email: profileData.email }).then(user => {
      const errors = {}
      if (user) {
        if (user.email != req.user.email) {
          errors.email = "Email Already Exists!";
          return res.status(400).json(errors);
        }
      }
      User.findOne({ userName: profileData.userName }).then(user => {

        if (user) {
          if (user.userName != req.user.userName) {
            errors.userName = "Username Already Exists!";
            return res.status(400).json(errors);
          }
        }


        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(profileData.password, salt, (err, hash) => {
            if (err) throw err;
            profileData.password = hash;
            User.findByIdAndUpdate(
              req.user._id,
              { $set: profileData },
              { new: true }
            ).then(user => res.json(user));
          });
        });
      })
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
    const { errors, isValid } = validatepasswordInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const password = req.body.password;
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    const profileData = {
      id: req.body.id,
      password,

    };

    User.findById(req.user._id).then(user => {
      bcrypt.compare(req.body.password1, user.password).then(isMatch => {
        if (isMatch) {


          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(profileData.password, salt, (err, hash) => {
              if (err) throw err;
              profileData.password = hash;
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
        else {
          errors.password1 = "Invalid password";
          errors.password2 = "Invalid password";
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

      isBlock,

    };
    console.log(profileData.isBlock);


    User.findById(req.user._id).then(user => {

      if (profileData.isBlock == 0) {
        profileData.isBlock = 1;
        console.log(profileData.isBlock);
        User.findByIdAndUpdate(
          req.user._id,
          { $set: profileData },
          { new: true }
        )
          .then(user => res.json(user))
          .catch(err => console.log(err));

      }
      else {
        profileData.isBlock = 0;
        console.log(profileData.isBlock);
        User.findByIdAndUpdate(
          req.user._id,
          { $set: profileData },
          { new: true }
        )
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }


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



// @routes  POST api/users/register
// @desc    Register/Edit a User
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
        const password = generatePassword();

        const newUser = new User({
          name: {
            firstName: req.body.firstname,
            middleName: req.body.middlename,
            lastName: req.body.lastname
          },
          email: req.body.email,
          password,
          avatar: "../../images/user.png",
          contact: req.body.contact,
          userType: req.body.usertype,
          college: req.body.college,
          invitedBy: `${req.user.name.firstName} ${req.user.name.lastName}`
        });

        const mailOptions = {
          from: "dummykrishield@gmail.com",
          to: req.body.email,
          subject: "Bulacan State University",
          text: `You are invited to be ${
            req.body.usertype
            } in Bulacan State University by ${req.user.name.firstName} ${
            req.user.name.lastName
            }
                
                Login to <todo link>
                Email: ${req.body.email}
                Password: ${password}
                `
        };
        Transporter.sendMail(mailOptions, function (error, info) {
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
          //Check password
          bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              //User Match!

              const payload = {
                id: user._id,
                userName: user.userName,
                email: user.email,
                contact: user.contact,
                firstName: user.name.firstName,
                middleName: user.name.middleName,
                lastName: user.name.lastName,
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
              errors.password = "Password Incorrect!";
              return res.status(400).json(errors);
            }
          });
        }
      });
    } else {
      //Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //User Match!

          const payload = {
            id: user._id,
            userName: user.userName,
            email: user.email,
            contact: user.contact,
            firstName: user.name.firstName,
            middleName: user.name.middleName,
            lastName: user.name.lastName,
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
          errors.password = "Password Incorrect!";
          return res.status(400).json(errors);
        }
      });
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
// @route   GET api/users/all
// @desc    Get activities
// @access  Public
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .sort({ date: -1 })
      .then(user => res.json(user))
      .catch(err =>
        res.status(404).json({ noActivitiesFound: "No User found" })
      );
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

      res.json(user);
    })
    .catch(err => res.status(404).json(err));
});


// @route   POST api/researches/images
// @desc    Add images to research
// @access  Private
router.post(
  "/images",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let imageArray = [];
    for (i = 0; i < req.body.images.length; i++) {
      const rand = uuid();
      // let ext = req.body.images[i].split(";")[0].split("/")[1];

      // if (ext == "jpeg") {
      //   ext = "jpg";
      // }

      // S3 upload
      s3 = new AWS.S3();

      const base64Data = new Buffer(
        req.body.images[i].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const type = req.body.images[i].split(";")[0].split("/")[1];

      const userId = 1;

      params = {
        Bucket: "bulsu-capstone",
        Key: `researchImages/${req.body.id + "-" + rand}.png`, // type is not required
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
      });

      imageArray.push(req.body.id + "-" + rand + ".png");
    }

    Research.findOne({ _id: req.body.id }).then(research => {
      for (i = 0; i < req.body.images.length; i++) {
        const newImage = {
          name: imageArray[i]
        };

        // Add to exp array
        research.images.unshift(newImage);
      }

      const newResearch = {
        lastUpdate: Date.now()
      };

      Research.findOneAndUpdate(
        { _id: req.body.id },
        { $set: newResearch },
        { new: true }
      ).then(research);

      // add activity
      const newActivity = {
        title: "Image added to " + research.title
      };
      new Activity(newActivity).save();

      research
        .save()
        .then(research => res.json(research))
        .catch(err => console.log(err));
    });
  }
);

module.exports = router;
