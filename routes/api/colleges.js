const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const randomColor = require("randomcolor");
const isEmpty = require("../../validation/is-empty");
const base64Img = require("base64-img");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");

// report templates
let pdfCollegeTemplate;
let pdfCollegesTemplate;
let fontFooter;

// if (process.env.NODE_ENV === "production") {
pdfCollegeTemplate = require("../../document/collegeTemplate");
pdfCollegesTemplate = require("../../document/collegesTemplate");
fontFooter = "7px";
// } else {
//   pdfCollegeTemplate = require("../../document/collegeTemplate_Dev");
//   pdfCollegesTemplate = require("../../document/collegesTemplate_Dev");
//   fontFooter = "10px";
// }

// College model
const College = require("../../models/College");
const Activity = require("../../models/Activity");
const User = require("../../models/User");

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
      // add activity
      const newActivity = {
        title: "College: " + req.body.initials + " updated",
        by: req.body.username,
        type: "College"
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
      librarianId: req.body.librarianId,
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
              // Check if college initials exists
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
                    title: "College: " + req.body.initials + " updated",
                    by: req.body.username,
                    type: "College"
                  };
                  new Activity(newActivity).save();

                  const newUserOld = {
                    college: ""
                  };

                  User.findOneAndUpdate(
                    { _id: req.body.oldLibId },
                    { $set: newUserOld },
                    { new: true }
                  )
                    .then(user => res.json(user))
                    .catch(err => console.log(err));

                  const newUser = {
                    college: req.body.fullName
                  };

                  User.findOneAndUpdate(
                    { _id: req.body.librarianId },
                    { $set: newUser },
                    { new: true }
                  )
                    .then(user => res.json(user))
                    .catch(err => console.log(err));

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
                    // add activity
                    const newActivity = {
                      title: "College: " + req.body.initials + " created",
                      by: req.body.username,
                      type: "College"
                    };
                    new Activity(newActivity).save();

                    const newUser = {
                      college: req.body.fullName
                    };

                    User.findOneAndUpdate(
                      { _id: req.body.librarianId },
                      { $set: newUser },
                      { new: true }
                    )
                      .then(user => res.json(user))
                      .catch(err => console.log(err));

                    // Save College
                    new College(newCollege)
                      .save()
                      .then(college => res.json(college));
                  });
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
    let mark = false;
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    College.findOne({ _id: req.body.colId }).then(college => {
      college.course.map(cou => {
        if (req.body.name === cou.name) {
          errors.name = "Course Name already exists";
          mark = true;
          res.status(400).json(errors);
        } else if (req.body.initials === cou.initials) {
          errors.initials = "Course Initials already exists";
          mark = true;
          res.status(400).json(errors);
        }
      });
      if (mark === false) {
        const newCourse = {
          name: req.body.name,
          initials: req.body.initials
        };

        // add activity
        const newActivity = {
          title:
            "Course: " +
            req.body.initials +
            " added in " +
            college.name.initials,
          by: req.body.username,
          type: "Course"
        };
        new Activity(newActivity).save().then(college);

        // Add to exp array
        college.course.unshift(newCourse);

        college.save().catch(err => console.log(err));

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
      }
    });
  }
);

// @route   POST api/colleges/editcourse
// @desc    Edit course of college
// @access  Private
router.post(
  "/editcourse",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body);
    let mark = false;
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    College.findOne({ _id: req.body.colId }).then(college => {
      college.course.map(cou => {
        if (req.body.name === cou.name && cou._id != req.body.courseId) {
          errors.name = "Course Name already exists";
          mark = true;
          return res.status(400).json(errors);
        } else if (
          req.body.initials === cou.initials &&
          cou._id != req.body.courseId
        ) {
          errors.initials = "Course Initials already exists";
          mark = true;
          return res.status(400).json(errors);
        }
      });
      if (mark === false) {
        const newCourse = {
          name: req.body.name,
          initials: req.body.initials,
          status: req.body.deactivate === false ? 0 : 1,
          deleted: req.body.deleted,
          researchTotal: req.body.researchTotal,
          journalTotal: req.body.journalTotal
        };

        // add activity
        const newActivity = {
          title:
            "Course: " +
            req.body.initials +
            " edited in " +
            college.name.initials,
          by: req.body.username,
          type: "Course"
        };
        new Activity(newActivity).save().then(college);

        // Get remove index
        const removeIndex = college.course
          .map(item => item.id)
          .indexOf(req.body.courseId);

        // Splice out of array
        college.course.splice(removeIndex, 1);

        // Add to exp array
        college.course.unshift(newCourse);

        college.save().catch(err => console.log(err));

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
      }
    });
  }
);

// @route   POST api/colleges/deletecourse
// @desc    Delete course from college
// @access  Private
router.post(
  "/deletecourse",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    College.findOne({ _id: req.body.collegeId })
      .then(college => {
        const newCourse = {
          name: req.body.courseName,
          initials: req.body.courseInitials,
          status: req.body.courseStatus,
          deleted: req.body.courseDeleted === 0 ? 1 : 0,
          researchTotal: req.body.courseTotalRes,
          journalTotal: req.body.courseTotalJour
        };

        const newCollege = {
          lastUpdate: {
            date: Date.now()
          }
        };
        College.findOneAndUpdate(
          { _id: req.body.collegeId },
          { $set: newCollege },
          { new: true }
        );

        let act;
        act =
          req.body.courseDeleted === 0
            ? "Course: Deleted in "
            : "Course: Restored in ";

        // add activity
        const newActivity = {
          title: act + college.name.initials,
          by: req.body.username,
          type: "Course"
        };
        new Activity(newActivity).save();
        // Get remove index
        const removeIndex = college.course
          .map(item => item.id)
          .indexOf(req.body.courseId);
        // Splice out of array
        college.course.splice(removeIndex, 1);
        // Add to exp array
        college.course.unshift(newCourse);
        // Save
        college.save().then(college => res.json(college));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/colleges/uploadS3/android
// @desc    Upload Generated report to s3 for android
// @access  Private
router.post(
  "/uploadS3/android",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // S3 upload
    const s3 = new AWS.S3();

    const base64Data = new Buffer(
      req.body.base64.replace(/^data:application\/\w+;base64,/, ""),
      "base64"
    );

    const params = {
      Bucket: "bulsu-capstone",
      Key: `androidReport/generatedReport.pdf`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `application/pdf` // required. Notice the back ticks
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return console.log(err);
      }

      console.log("-ANDROID- Report successfully uploaded.");
    });
  }
);

// @route   POST api/colleges/createReport/college
// @desc    Generate individual College Report
// @access  Private
router.post(
  "/createReport/college",
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
      .create(pdfCollegeTemplate(req.body), options)
      .toFile("collegePdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }

        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/colleges/fetchReport/college
// @desc    Send the generated pdf to client - individual college
// @access  Private
router.get(
  "/fetchReport/college",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/collegePdf.pdf`, () => {
      fs.unlink(`${reqPath}/collegePdf.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

// @route   POST api/colleges/createReport/colleges
// @desc    Generate List of all Colleges Report
// @access  Private
router.post(
  "/createReport/colleges",
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
      .create(pdfCollegesTemplate(req.body), options)
      .toFile("collegesPdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/colleges/fetchReport/colleges
// @desc    Send the generated pdf to client - list of colleges
// @access  Private
router.get(
  "/fetchReport/colleges",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/collegesPdf.pdf`, () => {
      fs.unlink(`${reqPath}/collegesPdf.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

// @route   POST api/colleges/remove/:id
// @desc    Delete college
// @access  Private
router.post(
  "/remove/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newCollege = {
      deleted: 1,
      lastUpdate: {
        date: Date.now()
      }
    };

    College.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newCollege },
      { new: true }
    ).then(college => {
      // add activity
      const newActivity = {
        title: "College: " + college.name.initials + " deleted",
        by: req.body.username,
        type: "College"
      };
      new Activity(newActivity).save();

      res.json(college);
    });
  }
);

// @route   POST api/colleges/restore/:id
// @desc    Resotre college
// @access  Private
router.post(
  "/restore/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newCollege = {
      deleted: 0,
      lastUpdate: {
        date: Date.now()
      }
    };

    College.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newCollege },
      { new: true }
    ).then(college => {
      // add activity
      const newActivity = {
        title: "College: " + college.name.initials + " restored",
        by: req.body.username,
        type: "College"
      };
      new Activity(newActivity).save();

      res.json(college);
    });
  }
);

// @route   POST api/colleges/restore/:id
// @desc    Restore college
// @access  Private
router.post(
  "/edit/count",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);

    const newCollege = {
      researchTotal: req.body.researchCount,
      journalTotal: req.body.journalCount
    };
    const _id = req.body.id;
    College.findOneAndUpdate({ _id }, { $set: newCollege }, { new: true }).then(
      college => {
        res.json(college);
      }
    );
  }
);

module.exports = router;
