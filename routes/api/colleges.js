const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const randomColor = require("randomcolor");
const isEmpty = require("../../validation/is-empty");
const base64Img = require("base64-img");
const fs = require("fs");

// College model
const College = require("../../models/College");
const Activity = require("../../models/Activity");

//Validator
const validateCollegeInput = require("../../validation/college");
const validateCourseInput = require("../../validation/course");

// file upload
const AWS = require("aws-sdk");
const s3config = require("../../config/s3keys");
AWS.config.update({
  accessKeyId: s3config.iamUser,
  secretAccessKey: s3config.iamSecret,
  region: "us-east-2"
});

// @route   GET api/colleges/test
// @desc    Tests get route
// @access  Public
// router.post("/test", (req, res) => {
//   const singleUpload = upload.single("file");
//   singleUpload(req, res, function(err) {
//     return res.json({ file: req.file });
//   });
// });

// @route   GET api/colleges
// @desc    Get colleges
// @access  Public
router.get("/all", (req, res) => {
  College.find()
    .sort({ "name.fullName": 1 })
    .then(colleges => res.json(colleges))
    .catch(err =>
      res.status(404).json({ nocollegesfound: "No Colleges found" })
    );
});

// @route   GET api/colleges/:initials
// @desc    Get college by initials
// @access  Public
router.get("/:initials", (req, res) => {
  const errors = {};

  College.findOne({ "name.initials": req.params.initials })
    .populate("college", ["name.fullName", "logo"])
    .then(college => {
      if (!college) {
        errors.nocollege = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(college);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/colleges/changeLogo
// @desc    Change College logo
// @access  Private
router.post(
  "/changeLogo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const date = Date.now();
    const logoName = req.body.initials + date + ".png";

    const newCollege = {
      logo: logoName,
      lastUpdate: {
        date: Date.now()
      }
    };

    //delete old logo from s3
    let s3 = new AWS.S3();

    let params = {
      Bucket: "bulsu-capstone",
      Key: `collegeLogos/${req.body.oldLogo}`
    };

    s3.deleteObject(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
    // try {
    //   fs.unlinkSync(`client/public/images/collegeLogos/${req.body.oldLogo}`);
    // } catch (error) {
    //   console.log(error);
    // }

    // move image to s3
    // S3 upload
    s3 = new AWS.S3();

    const base64Data = new Buffer(
      req.body.file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = req.body.file.split(";")[0].split("/")[1];

    const userId = 1;

    params = {
      Bucket: "bulsu-capstone",
      Key: `collegeLogos/${req.body.initials + date + ".png"}`, // type is not required
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

    // base64Img.img(
    //   req.body.file,
    //   "client/public/images/collegeLogos/",
    //   req.body.initials + date,
    //   function(err, filepath) {
    //     if (err) {
    //       console.log(err);
    //     }
    //   }
    // );

    // add activity
    const newActivity = {
      title: "College " + req.body.initials + " updated"
    };
    new Activity(newActivity).save();

    College.findOne({ _id: req.body.id }).then(college => {
      // Update
      College.findOneAndUpdate(
        { _id: req.body.id },
        { $set: newCollege },
        { new: true }
      ).then(college => res.json(college));
    });
  }
);

// @route   POST api/colleges
// @desc    Create / Update college
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCollegeInput(req.body);

    //Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    let { color, courseTotal, researchTotal, journalTotal } = req.body;
    let logoName;

    color = !isEmpty(color) ? color : randomColor();
    courseTotal = !isEmpty(courseTotal) ? courseTotal : "0";
    researchTotal = !isEmpty(researchTotal) ? researchTotal : "0";
    journalTotal = !isEmpty(journalTotal) ? journalTotal : "0";

    if (req.body.ext === "") {
      logoName = req.body.logo;
    } else {
      logoName = req.body.logo + ".png";
    }

    const newCollege = {
      name: {
        fullName: req.body.fullName,
        initials: req.body.initials
      },
      librarian: req.body.librarian,
      logo: logoName,
      courseTotal,
      researchTotal,
      journalTotal,
      color,
      lastUpdate: {
        date: Date.now()
      }
    };

    College.findOne({ _id: req.body.id }).then(college => {
      if (college) {
        // Check if college name exists
        College.findOne({ "name.fullName": req.body.fullName }).then(
          college => {
            let fullname;
            try {
              fullname = college.name.fullName;
            } catch (error) {
              fullname = "";
            }

            if (college && fullname != req.body.oldName) {
              errors.fullName = "College Name already exists";
              res.status(400).json(errors);
            } else {
              // Check if college name exists
              College.findOne({
                "name.initials": newCollege.name.initials
              }).then(college => {
                let initials;
                try {
                  initials = college.name.initials;
                } catch (error) {
                  initials = "";
                }

                if (college && initials != req.body.oldInitials) {
                  errors.initials = "College Initials already exists";
                  res.status(400).json(errors);
                } else {
                  // add activity
                  const newActivity = {
                    title: "College " + req.body.initials + " updated"
                  };
                  new Activity(newActivity).save();

                  // update college
                  College.findOneAndUpdate(
                    { _id: req.body.id },
                    { $set: newCollege },
                    { new: true }
                  ).then(college => res.json(college));
                }
              });
            }
          }
        );
      } else {
        // Check if college name exists
        College.findOne({ "name.fullName": req.body.fullName }).then(
          college => {
            if (college) {
              errors.fullName = "College Name already exists";
              res.status(400).json(errors);
            } else {
              // Check if college name exists
              College.findOne({
                "name.initials": newCollege.name.initials
              }).then(college => {
                if (college) {
                  errors.initials = "College Initials already exists";
                  res.status(400).json(errors);
                } else {
                  // S3 upload
                  const s3 = new AWS.S3();

                  const base64Data = new Buffer(
                    req.body.file.replace(/^data:image\/\w+;base64,/, ""),
                    "base64"
                  );

                  const type = req.body.file.split(";")[0].split("/")[1];

                  const userId = 1;

                  const params = {
                    Bucket: "bulsu-capstone",
                    Key: `collegeLogos/${req.body.logo}.png`, // type is not required
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

                  // if (req.body.file !== "") {
                  //   base64Img.img(
                  //     req.body.file,
                  //     "client/public/images/collegeLogos/",
                  //     req.body.logo,
                  //     function(err, filepath) {
                  //       if (err) {
                  //         console.log(err);
                  //       }
                  //     }
                  //   );
                  // }

                  // add activity
                  const newActivity = {
                    title: "College " + req.body.initials + " created"
                  };
                  new Activity(newActivity).save();

                  // Save College
                  new College(newCollege)
                    .save()
                    .then(college => res.json(college));
                }
              });
            }
          }
        );
      }
    });
  }
);

// @route   POST api/colleges/course
// @desc    Add course to college
// @access  Private
router.post(
  "/course",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    College.findOne({ _id: req.body.colId }).then(college => {
      const newCourse = {
        name: req.body.name,
        initials: req.body.initials
      };

      // add activity
      const newActivity = {
        title:
          "Course " + req.body.initials + " added in " + college.name.initials
      };
      new Activity(newActivity).save().then(college);

      // Add to exp array
      college.course.unshift(newCourse);

      college.save();

      const newCollege = {
        lastUpdate: {
          date: Date.now()
        }
      };

      College.findOneAndUpdate(
        { _id: req.body.colId },
        { $set: newCollege },
        { new: true }
      ).then(college => res.json(college));
    });
  }
);

// @route   DELETE api/colleges/course/:college_id/:course_id
// @desc    Delete course from college
// @access  Private
router.delete(
  "/course/:college_id/:course_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    College.findOne({ _id: req.params.college_id })
      .then(college => {
        // Get remove index
        const removeIndex = college.course
          .map(item => item.id)
          .indexOf(req.params.course_id);

        const newCollege = {
          lastUpdate: {
            date: Date.now()
          }
        };

        College.findOneAndUpdate(
          { _id: req.params.college_id },
          { $set: newCollege },
          { new: true }
        ).then(college);

        // add activity
        const newActivity = {
          title: "Course deleted in " + college.name.initials
        };
        new Activity(newActivity).save();

        // Splice out of array
        college.course.splice(removeIndex, 1);

        // Save
        college.save().then(college => res.json(college));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/colleges/:id
// @desc    Delete college
// @access  Private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    College.findOneAndDelete({ _id: req.params.id })
      .then(college => {
        res.json({ success: true });

        //delete old logo from s3
        // try {
        //   fs.unlinkSync(`client/public/images/collegeLogos/${req.body.logo}`);
        // } catch (error) {
        //   console.log(error);
        // }
        const s3 = new AWS.S3();

        const params = {
          Bucket: "bulsu-capstone",
          Key: `collegeLogos/${req.body.logo}`
        };

        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        });

        // add activity
        const newActivity = {
          title: "College " + college.name.initials + " deleted"
        };
        new Activity(newActivity).save();
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
