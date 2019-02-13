const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");
const base64Img = require("base64-img");
const fs = require("fs");
const pdf = require("pdf-parse");
const uuid = require("uuid");

// Research model
const Research = require("../../models/Research");
const College = require("../../models/College");
const Activity = require("../../models/Activity");

//Validator
const validateResearchInput = require("../../validation/research");
const validateAuthorInput = require("../../validation/author");

router.get("/pdfText", (req, res) => {
  let dataBuffer = fs.readFileSync(
    "client/public/documents/researchDocuments/sample.pdf"
  );

  pdf(dataBuffer).then(function(data) {
    res.json({ text: data.text });
    // // number of pages
    // console.log(data.numpages);
    // // number of rendered pages
    // console.log(data.numrender);
    // // PDF info
    // console.log(data.info);
    // // PDF metadata
    // console.log(data.metadata);
    // // PDF.js version
    // // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // // PDF text
    // console.log(data.text);
  });
});

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
        // add activity
        const newActivity = {
          title: "Research " + req.body.title + " updated"
        };
        new Activity(newActivity).save();

        // update college
        Research.findOneAndUpdate(
          { _id: req.body.id },
          { $set: newResearch },
          { new: true }
        ).then(research => res.json(research));
      } else {
        // Save Research
        new Research(newResearch).save();
        try {
          // increase college research total
          College.findOne({ "name.fullName": req.body.college }).then(
            college => {
              if (college) {
                // add activity
                const newActivity = {
                  title: "Research " + req.body.title + " added"
                };
                new Activity(newActivity).save();

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

      // add activity
      const newActivity = {
        title:
          req.body.name +
          " as " +
          req.body.role +
          " added as a Author to a research"
      };
      new Activity(newActivity).save();

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
        // add activity
        const newActivity = {
          title: "Research Updated, An Author has been removed"
        };
        new Activity(newActivity).save();

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

      // add activity
      const newActivity = {
        title: "Image added to a research"
      };
      new Activity(newActivity).save();

      research
        .save()
        .then(research => res.json(research))
        .catch(err => console.log(err));
    });
  }
);

// @route   POST api/researches/document
// @desc    Add document to research
// @access  Private
router.post(
  "/document",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rand = uuid();
    let base64String = req.body.file;
    let base64Doc = base64String.split(";base64,").pop();
    const filename = req.body.researchId + "-" + rand + ".pdf";

    if (req.body.oldFile) {
      // delete research document from client folder
      try {
        fs.unlinkSync(
          `client/public/documents/researchDocuments/${req.body.oldFile}`
        );
      } catch (error) {
        //console.log(error);
      }
    }

    fs.writeFile(
      `client/public/documents/researchDocuments/${req.body.researchId +
        "-" +
        rand}.pdf`,
      base64Doc,
      { encoding: "base64" },
      function(err) {
        console.log("file created");
      }
    );

    const newDocument = {
      document: filename
    };

    // add activity
    const newActivity = {
      title: "Document added to a research"
    };
    new Activity(newActivity).save();

    Research.findOneAndUpdate(
      { _id: req.body.researchId },
      { $set: newDocument },
      { new: true }
    ).then(research => res.json(research));
  }
);

// @route   DELETE api/researches/document/:research_id/:filename
// @desc    Delete document from research
// @access  Private
router.delete(
  "/document/:research_id/:filename",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // delete research document from client folder
    try {
      fs.unlinkSync(
        `client/public/documents/researchDocuments/${req.params.filename}`
      );
    } catch (error) {
      console.log(error);
    }

    const newDocument = {
      document: ""
    };

    // add activity
    const newActivity = {
      title: "Document Deleted from a research"
    };
    new Activity(newActivity).save();

    Research.findOneAndUpdate(
      { _id: req.params.research_id },
      { $set: newDocument },
      { new: true }
    ).then(research => res.json(research));
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
        //delete research images from client folder
        try {
          fs.unlinkSync(`client/public/images/researchImages/${image.name}`);
        } catch (error) {
          //console.log(error);
        }
      });

      // delete research document from client folder
      try {
        fs.unlinkSync(
          `client/public/documents/researchDocuments/${research.document}`
        );
      } catch (error) {
        //console.log(error);
      }
    });

    Research.findOne({ _id: req.params.id }).then(research => {
      try {
        College.findOne({ "name.fullName": research.college }).then(college => {
          if (college) {
            const total = --college.researchTotal;
            console.log(total);

            const newCollege = {
              researchTotal: total
            };

            //update research count on college
            College.findOneAndUpdate(
              { "name.fullName": research.college },
              { $set: newCollege },
              { new: true }
            ).then(college => res.json(college));
          }
        });

        // add activity
        const newActivity = {
          title: "A research has been deleted"
        };
        new Activity(newActivity).save();

        // delete research
        Research.findOneAndDelete({ _id: req.params.id })
          .then(console.log("Delete Successful"))
          .catch(err => res.status(404).json(err));
      } catch (error) {
        console.log(error);
      }
    });
  }
);

module.exports = router;
