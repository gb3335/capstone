const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const randomColor = require("randomcolor");
const isEmpty = require("../../validation/is-empty");

// College model
const College = require("../../models/College");

//Validator
const validateCollegeInput = require("../../validation/college");

// @route   GET api/colleges/test
// @desc    Tests get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Colleges Works" }));

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

// @route   GET api/colleges/initials/:initials
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

// @route   POST api/colleges
// @desc    Create / Update college
// @access  Private
router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCollegeInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    let { color, courseTotal, researchTotal, journalTotal } = req.body;

    color = !isEmpty(color) ? color : randomColor();
    courseTotal = !isEmpty(courseTotal) ? courseTotal : "0";
    researchTotal = !isEmpty(researchTotal) ? researchTotal : "0";
    journalTotal = !isEmpty(journalTotal) ? journalTotal : "0";

    const newCollege = {
      name: {
        fullName: req.body.fullName,
        initials: req.body.initials
      },
      librarian: req.body.librarian,
      logo: req.body.logo,
      courseTotal,
      researchTotal,
      journalTotal,
      color
    };

    College.findOne({ _id: req.body.id }).then(college => {
      if (college) {
        // Update
        College.findOneAndUpdate(
          { _id: req.body.id },
          { $set: newCollege },
          { new: true }
        ).then(college => res.json(college));
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

// @route   DELETE api/colleges
// @desc    Delete college
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    College.findOneAndRemove({ fullName: req.body.name }).then(() => {
      res.json({ success: true });
    });
  }
);

module.exports = router;