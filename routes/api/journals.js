const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");
const base64Img = require("base64-img");
const fs = require("fs");
const uuid = require("uuid");
const Tokenizer = require("sentence-tokenizer");
const download = require("download-pdf");
const pdfUtil = require("pdf-to-text");
const path = require("path");
const pdf = require("html-pdf");

// Text Processor
const processor = require("../../validation/plagiarism/processor");

// report templates
let pdfJournalsTemplate;
let pdfJournalTemplate;
let fontFooter;

// if (process.env.NODE_ENV === "production") {
pdfJournalsTemplate = require("../../document/journalsTemplate");
pdfJournalTemplate = require("../../document/journalTemplate");
fontFooter = "7px";
// } else {
//   pdfJournalsTemplate = require("../../document/journalsTemplate_Dev");
//   pdfJournalTemplate = require("../../document/journalTemplate_Dev");
//   fontFooter = "10px";
// }

// Journal model
const Journal = require("../../models/Journal");
const College = require("../../models/College");
const Activity = require("../../models/Activity");

// file upload
const AWS = require("aws-sdk");
const s3config = require("../../config/s3keys");
AWS.config.update({
  accessKeyId: s3config.iamUser,
  secretAccessKey: s3config.iamSecret,
  region: "us-east-2"
});

//Validator
const validateJournalInput = require("../../validation/journal");
const validateAuthorInput = require("../../validation/author");

router.get("/pdfText", (req, res) => {
  let dataBuffer = fs.readFileSync(
    "client/public/documents/journalDocuments/sample.pdf"
  );

  pdf(dataBuffer).then(function (data) {
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

// @route   GET api/journals/test
// @desc    Tests get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Journal Works" }));

// @route   GET api/journals
// @desc    Get journals
// @access  Public
router.get("/", (req, res) => {
  Journal.find({})
    .sort({ title: 1 })
    .then(journals => res.json(journals))
    .catch(err =>
      res.status(404).json({ nojournalfound: "No Journals found" })
    );
});

// @route   GET api/journals/:id
// @desc    Get journal by id
// @access  Public
router.get("/:id", (req, res) => {
  const errors = {};
  Journal.findOne({ _id: req.params.id }, { content: 0 })
    .then(journal => {
      if (!journal) {
        errors.nojournal = "There is no data for this journal";
        res.status(404).json(errors);
      }
      delete journal.content;
      res.json(journal);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/journals
// @desc    Create / Update journal
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateJournalInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Journal.findOne({ _id: req.body.id }).then(journal => {
      if (journal) {
        Journal.findOne({ title: req.body.title }).then(journal => {
          let title;
          let copyAuthorArray = [];
          try {
            title = journal.title;
            copyAuthorArray = journal.author;
          } catch (error) {
            title = "";
          }
          if (journal && title != req.body.oldTitle) {
            errors.title = "Journal Title already exists";
            res.status(400).json(errors);
          } else {
            // add activity
            const newActivity = {
              title: "Journal: " + req.body.title + " updated",
              type: "Journal",
              by: req.body.username
            };
            new Activity(newActivity).save();

            let authorArray = [];
            authorArray.push({
              name: req.body.authorOne,
              role: "Author One"
            });

            copyAuthorArray.map(aut => {
              aut.role === "Author"
                ? authorArray.push({
                  name: aut.name,
                  role: "Author"
                })
                : "";
            });

            let newJournal = {
              title: req.body.title,
              college: req.body.college,
              course: req.body.course,
              description: req.body.description,
              issn: req.body.issn,
              pages: req.body.pages,
              publisher: req.body.publisher,
              volume: req.body.volume,
              yearPublished: req.body.yearPublished,
              author: authorArray,
              lastUpdate: Date.now()
            };

            // Add new Author One and existing

            // update college
            Journal.findOneAndUpdate(
              { _id: req.body.id },
              { $set: newJournal },
              { new: true }
            )
              .then(journal => {
                delete journal.content;
                res.json(journal);
              })
              .catch(err => console.log(err));
          }
        });
      } else {
        Journal.findOne({ title: req.body.title }).then(journal => {
          if (journal) {
            errors.title = "Journal Title already exists";
            res.status(400).json(errors);
          } else {
            try {
              // increase college journal total
              College.findOne({ "name.fullName": req.body.college }).then(
                college => {
                  if (college) {
                    // add activity
                    const newActivity = {
                      title: "Journal: " + req.body.title + " added",
                      type: "Journal",
                      by: req.body.username
                    };
                    new Activity(newActivity).save();

                    let courseResTotal;
                    let dupliCourse;
                    let courseId;
                    college.course.map(cou => {
                      if (cou.name === req.body.course) {
                        courseId = cou._id;
                        dupliCourse = cou;
                        courseResTotal = ++dupliCourse.journalTotal;
                        dupliCourse.journalTotal = courseResTotal;
                      }
                    });

                    // Get remove index
                    const removeIndex = college.course
                      .map(item => item._id)
                      .indexOf(courseId);

                    //console.log(removeIndex);

                    // Splice out of array
                    college.course.splice(removeIndex, 1);

                    // Add to course array
                    college.course.unshift(dupliCourse);

                    college.save();

                    const total = ++college.journalTotal;

                    const newCollege = {
                      journalTotal: total
                    };

                    let authorArray = [];
                    authorArray.push({
                      name: req.body.authorOne,
                      role: "Author One"
                    });

                    let newJournal = {
                      title: req.body.title,
                      college: req.body.college,
                      course: req.body.course,
                      description: req.body.description,
                      issn: req.body.issn,
                      pages: req.body.pages,
                      publisher: req.body.pages,
                      volume: req.body.volume,
                      yearPublished: req.body.yearPublished,
                      author: authorArray,
                      lastUpdate: Date.now()
                    };

                    // Save Journal
                    new Journal(newJournal).save();

                    College.findOneAndUpdate(
                      { "name.fullName": req.body.college },
                      { $set: newCollege },
                      { new: true }
                    )
                      .then(college => res.json(college))
                      .catch(err => console.log(err));
                  }
                }
              );
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    });
  }
);

// @route   POST api/journals/author
// @desc    Add author to journal
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

    Journal.findOne({ _id: req.body.journalId }).then(journal => {
      const newAuthor = {
        name: req.body.name,
        role: req.body.role
      };

      // add activity
      const newActivity = {
        title:
          "Journal: " + req.body.name + " added as Author in " + journal.title,
        by: req.body.username,
        type: "Journal"
      };
      new Activity(newActivity).save();

      const newJournal = {
        lastUpdate: Date.now()
      };

      Journal.findOneAndUpdate(
        { _id: req.body.journalId },
        { $set: newJournal },
        { new: true }
      ).then(journal);

      // Add to exp array
      journal.author.unshift(newAuthor);

      journal.save().then(journal => {
        delete journal.content;
        res.json(journal);
      });
    });
  }
);

// @route   DELETE api/journals/author/:journal_id/:author_id
// @desc    Delete author from journal
// @access  Private
router.delete(
  "/author/:journal_id/:author_id/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Journal.findOne({ _id: req.params.journal_id })
      .then(journal => {
        // Get remove index
        const removeIndex = journal.author
          .map(item => item.id)
          .indexOf(req.params.author_id);

        // add activity
        const newActivity = {
          title:
            "Journal: " +
            journal.author[removeIndex].name +
            " removed as " +
            journal.author[removeIndex].role +
            " in " +
            journal.title,

          by: req.params.name,
          type: "Journal"
        };
        new Activity(newActivity).save();

        const newJournal = {
          lastUpdate: Date.now()
        };

        Journal.findOneAndUpdate(
          { _id: req.params.journal_id },
          { $set: newJournal },
          { new: true }
        ).then(journal);

        // Splice out of array
        journal.author.splice(removeIndex, 1);

        // Save
        journal.save().then(journal => {
          delete journal.content;
          res.json(journal);
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/journals/images
// @desc    Add images to journal
// @access  Private
router.post(
  "/images",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let imageArray = [];
    let imageLen = 0;
    for (i = 0; i < req.body.images.length; i++) {
      const rand = uuid();
      s3 = new AWS.S3();

      const base64Data = new Buffer(
        req.body.images[i].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const type = req.body.images[i].split(";")[0].split("/")[1];

      const userId = 1;

      params = {
        Bucket: "bulsu-capstone",
        Key: `journalImages/${req.body.id + "-" + rand}.png`, // type is not required
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
        ++imageLen;
        // check if all images is uploaded
        if (imageLen === req.body.images.length) {
          Journal.findOne({ _id: req.body.id }).then(journal => {
            for (i = 0; i < req.body.images.length; i++) {
              const newImage = {
                name: imageArray[i]
              };

              // Add to exp array
              journal.images.unshift(newImage);
            }

            const newResearch = {
              lastUpdate: Date.now()
            };

            Journal.findOneAndUpdate(
              { _id: req.body.id },
              { $set: newResearch },
              { new: true }
            ).then(journal);

            // add activity
            const newActivity = {
              title: "Journal: Image/s added to " + journal.title,
              by: req.body.username,
              type: "Journal"
            };
            new Activity(newActivity).save();

            journal
              .save()
              .then(journal => {
                delete journal.content;
                res.json(journal);
              })
              .catch(err => console.log(err));
          });
        }
      });
      imageArray.push(req.body.id + "-" + rand + ".png");
    }
  }
);

// @route   POST api/journals/document
// @desc    Add document to journal
// @access  Private
router.post(
  "/document",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rand = uuid();
    let base64String = req.body.file;
    let base64Doc = base64String.split(";base64,").pop();
    const filename = req.body.journalId + "-" + rand + ".pdf";

    if (req.body.oldFile) {
      // delete journal document from s3
      let s3 = new AWS.S3();

      let params = {
        Bucket: "bulsu-capstone",
        Key: `journalDocuments/${req.body.oldFile}`
      };

      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      });
    }
    // S3 upload
    s3 = new AWS.S3();

    const base64Data = new Buffer(
      base64Doc.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = base64String.split(";")[0].split("/")[1];

    const userId = 1;

    let researchObject = {};

    params = {
      Bucket: "bulsu-capstone",
      Key: `journalDocuments/${req.body.journalId + "-" + rand}.pdf`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `application/pdf` // required. Notice the back ticks
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return console.log(err);
      }
      const docPath =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/journalDocuments/" +
        filename;
      const options = {
        directory: "./routes/downloadedDocu",
        filename: req.body.journalId + ".pdf"
      };
      download(docPath, options, function (err) {
        if (err) console.log(err);
        console.log("Document successfully downloaded.");
        pdfUtil.pdfToText(
          `./routes/downloadedDocu/${options.filename}`,
          function (err, data) {
            fs.unlink(`./routes/downloadedDocu/${options.filename}`, err => {
              if (err) throw err;
              console.log("successfully deleted");
            });

            let { text, len } = processor.textProcess(
              data.toString().toLowerCase()
            );

            const newDocument = {
              document: filename,
              content: {
                text,
                sentenceLength: len
              },
              lastUpdate: Date.now()
            };
            Journal.findOne({ _id: req.body.journalId }).then(journal => {
              // add activity
              const newActivity = {
                title: "Document added to " + journal.title,
                by: req.body.username
              };
              new Activity(newActivity).save();
            });

            Journal.findOneAndUpdate(
              { _id: req.body.journalId },
              { $set: newDocument },
              { new: true }
            ).then(journal => {
              delete journal.content;
              res.json(journal);
            });
          }
        );
      });
    });
  }
);

// @route   DELETE api/journals/document/:journal_id/:filename
// @desc    Delete document from journal
// @access  Private
router.delete(
  "/document/:journal_id/:filename/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //delete journal document from s3
    let s3 = new AWS.S3();

    let params = {
      Bucket: "bulsu-capstone",
      Key: `journalDocuments/${req.params.filename}`
    };

    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });

    const newDocument = {
      document: "",
      content: {
        text: "",
        sentenceLength: ""
      },
      lastUpdate: Date.now()
    };

    Journal.findOne({ _id: req.params.journal_id }).then(journal => {
      // add activity
      const newActivity = {
        title: "Document removed from " + journal.title,
        by: req.params.name
      };
      new Activity(newActivity).save();
    });

    Journal.findOneAndUpdate(
      { _id: req.params.journal_id },
      { $set: newDocument },
      { new: true }
    ).then(journal => {
      delete journal.content;
      res.json(journal);
    });
  }
);

// @route   POST api/journals/createReport/journals
// @desc    Generate List of all journals Report
// @access  Private
router.post(
  "/createReport/journals",
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
      .create(pdfJournalsTemplate(req.body), options)
      .toFile("journalsPdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/journals/fetchReport/journals
// @desc    Send the generated pdf to client - list of journals
// @access  Private
router.get(
  "/fetchReport/journals",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/journalsPdf.pdf`, () => {
      fs.unlink(`${reqPath}/journalsPdf.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

// @route   POST api/journals/createReport/journal
// @desc    Generate individual journal Report
// @access  Private
router.post(
  "/createReport/journal",
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
      .create(pdfJournalTemplate(req.body), options)
      .toFile("journalPdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/journals/fetchReport/journal
// @desc    Send the generated pdf to client - individual journal
// @access  Private
router.get(
  "/fetchReport/journal",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/journalPdf.pdf`, () => {
      fs.unlink(`${reqPath}/journalPdf.pdf`, err => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    });
  }
);

// @route   DELETE api/journals/remove/:id
// @desc    Delete journal
// @access  Private
router.post(
  "/remove/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let newJournal;
    if (req.body.hidden) {
      newJournal = {
        hidden: 1
      };
    } else {
      newJournal = {
        deleted: 1
      };
    }

    Journal.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newJournal },
      { new: true }
    ).then(journal => {
      // add activity
      const newActivity = {
        title: req.body.hidden
          ? "Journal: " + journal.title + " hidden from list"
          : "Journal: " + journal.title + " moved to bin",
        by: req.body.username
      };
      new Activity(newActivity).save();

      // increase decrease journal count in college and course
      College.findOne({ "name.fullName": journal.college }).then(college => {
        let journalCount = parseInt(college.journalTotal, 10);
        let newCourse;
        let removeIndex;
        const newCollege = {
          journalTotal: req.body.hidden ? journalCount : --journalCount
        };

        college.course.map((cou, index) => {
          if (cou.name === journal.course) {
            newCourse = {
              name: cou.name,
              initials: cou.initials,
              status: cou.status,
              deleted: cou.deleted,
              journalTotal: req.body.hidden
                ? cou.journalTotal
                : --cou.journalTotal,
              journalTotal: cou.journalTotal
            };
            removeIndex = index;
          }
        });

        // Splice out of array
        college.course.splice(removeIndex, 1);
        // Add to exp array
        college.course.unshift(newCourse);
        // Save college for course
        college.save();
        // save college
        College.findOneAndUpdate(
          { "name.fullName": college.name.fullName },
          { $set: newCollege },
          { new: true }
        ).then(journal);
      });
      delete journal.content;
      res.json(journal);
    });
  }
);

// @route   POST api/journal/restore/:id
// @desc    Restore journal
// @access  Private
router.post(
  "/restore/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let newJournal;
    if (req.body.hidden) {
      newJournal = {
        hidden: 0
      };
    } else {
      newJournal = {
        deleted: 0
      };
    }

    Journal.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newJournal },
      { new: true }
    ).then(journal => {
      // add activity
      const newActivity = {
        title: req.body.hidden
          ? "Journal: " + journal.title + " showed in list"
          : "Journal: " + journal.title + " restored from bin",
        by: req.body.username
      };
      new Activity(newActivity).save();

      // increase journal count in college and course
      College.findOne({ "name.fullName": journal.college }).then(college => {
        let journalCount = parseInt(college.journalTotal, 10);
        let newCourse;
        let removeIndex;
        const newCollege = {
          journalTotal: req.body.hidden ? journalCount : ++journalCount
        };

        college.course.map((cou, index) => {
          if (cou.name === journal.course) {
            newCourse = {
              name: cou.name,
              initials: cou.initials,
              status: cou.status,
              deleted: cou.deleted,
              journalTotal: req.body.hidden
                ? cou.journalTotal
                : ++cou.journalTotal,
              journalTotal: cou.journalTotal
            };
            removeIndex = index;
          }
        });

        // Splice out of array
        college.course.splice(removeIndex, 1);
        // Add to exp array
        college.course.unshift(newCourse);
        // Save college for course
        college.save();
        // save college
        College.findOneAndUpdate(
          { "name.fullName": college.name.fullName },
          { $set: newCollege },
          { new: true }
        ).then(journal);
      });
      delete journal.content;
      res.json(journal);
    });
  }
);

module.exports = router;
