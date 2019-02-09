const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");
const base64Img = require("base64-img");
const fs = require("fs");
const uuid = require("uuid");

// Research model
const Research = require("../../models/Research");
const College = require("../../models/College");

//Validator
const validateResearchInput = require("../../validation/research");
const validateAuthorInput = require("../../validation/author");

// @route   GET api/researches/test
// @desc    Tests get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Research Works" }));

// @route   GET api/researches
// @desc    Get colleges
// @access  Public
router.get("/", (req, res) => {
  Research.find()
    .sort({ title: 1 })
    .then(researches => res.json(researches))
    .catch(err =>
      res.status(404).json({ noresearchfound: "No Researches found" })
    );
});

// @route   GET api/researches/:id
// @desc    Get research by id
// @access  Public
router.get("/:id", (req, res) => {
  const errors = {};
  Research.findOne({ _id: req.params.id })
    .populate("research", ["title", "_id"])
    .then(research => {
      if (!research) {
        errors.noresearch = "There is no data for this research";
        res.status(404).json(errors);
      }

      res.json(research);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/researches
// @desc    Create / Update research
// @access  Private
router.post(
  "/",
  //passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateResearchInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newResearch = {
      title: req.body.title,
      type: req.body.type,
      college: req.body.college,
      course: req.body.course,
      abstract: req.body.abstract,
      pages: req.body.pages
    };

    Research.findOne({ _id: req.body.id }).then(research => {
      if (research) {
        // update college
        Research.findOneAndUpdate(
          { _id: req.body.id },
          { $set: newResearch },
          { new: true }
        ).then(research => res.json(research));
      } else {
        // Save Research
        new Research(newResearch).save().then(research => res.json(research));
        try {
          // increase college research total
          College.findOne({ "name.fullName": req.body.college }).then(
            college => {
              if (college) {
                const total = ++college.researchTotal;

                const newCollege = {
                  researchTotal: total
                };

                College.findOneAndUpdate(
                  { "name.fullName": req.body.college },
                  { $set: newCollege },
                  { new: true }
                ).then(college => res.json(college));
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
);

// @route   POST api/researches/author
// @desc    Add author to research
// @access  Private
router.post(
  "/author",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAuthorInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Research.findOne({ _id: req.body.researchId }).then(research => {
      const newAuthor = {
        name: req.body.name,
        role: req.body.role
      };

      // Add to exp array
      research.author.unshift(newAuthor);

      research.save().then(research => res.json(research));
    });
  }
);

// @route   DELETE api/researches/author/:research_id/:author_id
// @desc    Delete author from research
// @access  Private
router.delete(
  "/author/:research_id/:author_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Research.findOne({ _id: req.params.research_id })
      .then(research => {
        // Get remove index
        const removeIndex = research.author
          .map(item => item.id)
          .indexOf(req.params.author_id);

        // Splice out of array
        research.author.splice(removeIndex, 1);

        // Save
        research.save().then(research => res.json(research));
      })
      .catch(err => res.status(404).json(err));
  }
);

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
      let ext = req.body.images[i].split(";")[0].split("/")[1];

      if (ext == "jpeg") {
        ext = "jpg";
      }

      base64Img.img(
        req.body.images[i],
        "client/public/images/researchImages/",
        req.body.id + "-" + rand,
        function(err, filepath) {
          if (err) {
            console.log(err);
          }
        }
      );
      console.log(ext);

      imageArray.push(req.body.id + "-" + rand + "." + ext);
    }

    Research.findOne({ _id: req.body.id }).then(research => {
      for (i = 0; i < req.body.images.length; i++) {
        const newImage = {
          name: imageArray[i]
        };

        // Add to exp array
        research.images.unshift(newImage);
      }

      research
        .save()
        .then(research => res.json(research))
        .catch(err => console.log(err));
    });
  }
);

// @route   DELETE api/researches/:id
// @desc    Delete research
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Research.findOne({ _id: req.params.id }).then(research => {
      research.images.map(image => {
        //delete old logo from client folder
        try {
          fs.unlinkSync(`client/public/images/researchImages/${image.name}`);
        } catch (error) {
          console.log(error);
        }
      });
      try {
        // decrease college research total
        College.findOne({ "name.fullName": research.college }).then(college => {
          if (college) {
            const total = --college.researchTotal;

            const newCollege = {
              researchTotal: total
            };

            // update research count on college
            College.findOneAndUpdate(
              { "name.fullName": research.college },
              { $set: newCollege },
              { new: true }
            ).then(college => res.json(college));
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    Research.findOneAndDelete({ _id: req.params.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
