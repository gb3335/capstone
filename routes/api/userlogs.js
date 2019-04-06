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
            date: currentElement.date,
            type: currentElement.type,
            by: currentElement.by

          })

        });
        res.json(user)


      }

      )


  }
);


router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

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
      .toFile("userlogsPdf.pdf", err => {
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
    res.sendFile(`${reqPath}/userlogsPdf.pdf`, () => {
      fs.unlink(`${reqPath}/userlogsPdf.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);





module.exports = router;
