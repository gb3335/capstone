const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const randomColor = require("randomcolor");
const isEmpty = require("../../validation/is-empty");

// Research model
const Research = require("../../models/Research");

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
    console.log("backend: ", req.body.id);
    res.json({ success: "true" });
  }
);

// @route   DELETE api/researches/:id
// @desc    Delete research
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Research.findOneAndDelete({ _id: req.params.id })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
