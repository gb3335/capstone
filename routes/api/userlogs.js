const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");

let pdfActivityTemplate = require("../../document/userlogTemplate");
let fontFooter = "7px";

// Userlog model
const UserLog = require("../../models/UserLog");



// @route   GET api/userlogs/test
// @desc    Tests get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Uselog Works" }));

// @route   GET api/userlogs/all
// @desc    Get all logs
// @access  Public
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Userlog.find()
      .sort({ date: -1 })
      .then(userlogs => res.json(userlogs))
      .catch(err =>
        res.status(404).json({ noUserLogsFound: "No Userlogs found" })
      );
  }
);


router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {





    // Add new Author One and existing

    // update college



    const newUser = new UserLog({
      name: {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName
      },
      email: req.body.email,
      userType: req.body.usertype,
      college: req.body.college,
      contact: req.body.contact
    });

    newUser
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err));










  })





module.exports = router;
