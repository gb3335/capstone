const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// College model
const Activity = require("../../models/Activity");

// @route   GET api/activities/test
// @desc    Tests get route
// @access  Public
//router.get("/test", (req, res) => res.json({ msg: "Colleges Works" }));

// @route   GET api/activities
// @desc    Get activities
// @access  Public
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Activity.find()
      .sort({ date: -1 })
      .then(activities => res.json(activities))
      .catch(err =>
        res.status(404).json({ noActivitiesFound: "No Activities found" })
      );
  }
);

module.exports = router;
