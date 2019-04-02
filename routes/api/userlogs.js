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


    UserLog.find()
      .sort({ date: -1 })
      .then(user => {
        const payload = []
        const list = user
        list.map((currentElement, index) => {
          payload.push({

            id: currentElement._id,
            userName: currentElement.userName,
            email: currentElement.email,
            contact: currentElement.contact,
            firstName: currentElement.name.firstName,
            middleName: currentElement.name.middleName,
            lastName: currentElement.name.lastName,
            avatar: currentElement.avatar,
            userType: currentElement.userType,
            isLock: currentElement.isLock,
            isBlock: currentElement.isBlock,
            invitedBy: currentElement.invitedBy,
            college: currentElement.college,
            date: currentElement.date,
            type: currentElement.type


          })

        });
        res.json(payload)


      }

      )


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
