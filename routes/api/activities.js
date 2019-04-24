const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");

let pdfActivityTemplate = require("../../document/activityTemplate");
let fontFooter = "7px";

// College model
const Activity = require("../../models/Activity");

// @route   GET api/activities/test
// @desc    Tests get route
// @access  Public
//router.get("/test", (req, res) => res.json({ msg: "Colleges Works" }));

// @route   GET api/activities/all
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

// @route   GET api/activities/all/android
// @desc    Get activities for android w/ limit
// @access  Public
router.get(
  "/all/android",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Activity.find()
      .sort({ date: -1 })
      .limit(150)
      .then(activities => res.json(activities))
      .catch(err =>
        res.status(404).json({ noActivitiesFound: "No Activities found" })
      );
  }
);

// @route   POST api/activities/createReport
// @desc    Generate List of Recent activities
// @access  Private
router.post(
  "/createReport",
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
      .create(pdfActivityTemplate(req.body), options)
      .toFile("activityPdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/activities/fetchReport
// @desc    Send the generated pdf to client - list of colleges
// @access  Private
router.get(
  "/fetchReport",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/activityPdf.pdf`, () => {
      fs.unlink(`${reqPath}/activityPdf.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

module.exports = router;
