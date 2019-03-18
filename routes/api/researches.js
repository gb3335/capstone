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
const path = require("path");
const pdf = require("html-pdf");

// report templates
let pdfResearchesTemplate;
let pdfResearchTemplate;
let fontFooter;

if (process.env.NODE_ENV === "production") {
  pdfResearchesTemplate = require("../../document/researchesTemplate");
  pdfResearchTemplate = require("../../document/researchTemplate");
  fontFooter = "7px";
} else {
  pdfResearchesTemplate = require("../../document/researchesTemplate_Dev");
  pdfResearchTemplate = require("../../document/researchTemplate_Dev");
  fontFooter = "10px";
}

// Research model
const Research = require("../../models/Research");
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
const validateResearchInput = require("../../validation/research");
const validateAuthorInput = require("../../validation/author");

router.get("/pdfText", (req, res) => {
  let dataBuffer = fs.readFileSync(
    "client/public/documents/researchDocuments/sample.pdf"
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

// @route   GET api/researches/test
// @desc    Tests get route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Research Works" }));

// @route   GET api/researches
// @desc    Get researches
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
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateResearchInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Research.findOne({ _id: req.body.id }).then(research => {
      if (research) {
        Research.findOne({ title: req.body.title }).then(research => {
          let title;
          let copyAuthorArray = [];
          try {
            title = research.title;
            copyAuthorArray = research.author;
          } catch (error) {
            title = "";
          }
          if (research && title != req.body.oldTitle) {
            errors.title = "Research Title already exists";
            res.status(400).json(errors);
          } else {
            // add activity
            const newActivity = {
              title: "Research " + req.body.title + " updated"
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

            let newResearch = {
              title: req.body.title,
              type: req.body.type,
              college: req.body.college,
              course: req.body.course,
              abstract: req.body.abstract,
              researchID: req.body.researchId,
              pages: req.body.pages,
              schoolYear: req.body.schoolYear,
              author: authorArray,
              lastUpdate: Date.now()
            };

            // Add new Author One and existing

            // update college
            Research.findOneAndUpdate(
              { _id: req.body.id },
              { $set: newResearch },
              { new: true }
            )
              .then(research => res.json(research))
              .catch(err => console.log(err));
          }
        });
      } else {
        Research.findOne({ title: req.body.title }).then(research => {
          if (research) {
            errors.title = "Research Title already exists";
            res.status(400).json(errors);
          } else {
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

                    let courseResTotal;
                    let dupliCourse;
                    let courseId;
                    college.course.map(cou => {
                      if (cou.name === req.body.course) {
                        courseId = cou._id;
                        dupliCourse = cou;
                        courseResTotal = ++dupliCourse.researchTotal;
                        dupliCourse.researchTotal = courseResTotal;
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

                    const total = ++college.researchTotal;

                    const newCollege = {
                      researchTotal: total
                    };

                    let authorArray = [];
                    authorArray.push({
                      name: req.body.authorOne,
                      role: "Author One"
                    });

                    let newResearch = {
                      title: req.body.title,
                      type: req.body.type,
                      college: req.body.college,
                      course: req.body.course,
                      abstract: req.body.abstract,
                      researchID: req.body.researchId,
                      pages: req.body.pages,
                      schoolYear: req.body.schoolYear,
                      author: authorArray,
                      lastUpdate: Date.now()
                    };

                    // Save Research
                    new Research(newResearch).save();

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
        title: req.body.name + " added as Author in " + research.title
      };
      new Activity(newActivity).save();

      const newResearch = {
        lastUpdate: Date.now()
      };

      Research.findOneAndUpdate(
        { _id: req.body.researchId },
        { $set: newResearch },
        { new: true }
      ).then(research);

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

        // add activity
        const newActivity = {
          title:
            research.author[removeIndex].name +
            " removed as " +
            research.author[removeIndex].role +
            " in " +
            research.title
        };
        new Activity(newActivity).save();

        const newResearch = {
          lastUpdate: Date.now()
        };

        Research.findOneAndUpdate(
          { _id: req.params.research_id },
          { $set: newResearch },
          { new: true }
        ).then(research);

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
      // let ext = req.body.images[i].split(";")[0].split("/")[1];

      // if (ext == "jpeg") {
      //   ext = "jpg";
      // }

      // S3 upload
      s3 = new AWS.S3();

      const base64Data = new Buffer(
        req.body.images[i].replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const type = req.body.images[i].split(";")[0].split("/")[1];

      const userId = 1;

      params = {
        Bucket: "bulsu-capstone",
        Key: `researchImages/${req.body.id + "-" + rand}.png`, // type is not required
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
      });

      imageArray.push(req.body.id + "-" + rand + ".png");
    }

    Research.findOne({ _id: req.body.id }).then(research => {
      for (i = 0; i < req.body.images.length; i++) {
        const newImage = {
          name: imageArray[i]
        };

        // Add to exp array
        research.images.unshift(newImage);
      }

      const newResearch = {
        lastUpdate: Date.now()
      };

      Research.findOneAndUpdate(
        { _id: req.body.id },
        { $set: newResearch },
        { new: true }
      ).then(research);

      // add activity
      const newActivity = {
        title: "Image added to " + research.title
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
      // delete research document from s3
      let s3 = new AWS.S3();

      let params = {
        Bucket: "bulsu-capstone",
        Key: `researchDocuments/${req.body.oldFile}`
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
      Key: `researchDocuments/${req.body.researchId + "-" + rand}.pdf`, // type is not required
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64", // required
      ContentType: `application/pdf` // required. Notice the back ticks
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return console.log(err);
      }
      // const docPath =
      //   "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" +
      //   filename;
      // const options = {
      //   directory: "./routes/downloadedDocu",
      //   filename: req.body.researchId + ".pdf"
      // };
      // download(docPath, options, function (err) {
      //   if (err) console.log(err);
      //   console.log("Document successfully uploaded.");
      // });

      const newDocument = {
        document: filename,
        lastUpdate: Date.now()
      };
      Research.findOne({ _id: req.body.researchId }).then(research => {
        // add activity
        const newActivity = {
          title: "Document added to " + research.title
        };
        new Activity(newActivity).save();
      });

      Research.findOneAndUpdate(
        { _id: req.body.researchId },
        { $set: newDocument },
        { new: true }
      ).then(research => res.json(research));
    });

    // fs.writeFile(
    //   `client/public/documents/researchDocuments/${req.body.researchId +
    //     "-" +
    //     rand}.pdf`,
    //   base64Doc,
    //   { encoding: "base64" },
    //   function(err) {
    //     console.log("file created");
    //     let pdfString;
    //     let documentsArray = [];
    //     let pdfStringForAll;
    //     fs.readFile(
    //       `client/public/documents/researchDocuments/${req.body.researchId +
    //         "-" +
    //         rand}.pdf`,
    //       (err, pdfBuffer) => {
    //         try {
    //           new PdfReader().parseBuffer(pdfBuffer, function(err, item) {
    //             if (err) {
    //               console.log(err);
    //             } else if (!item) {
    //               // finished reading texts
    //               const tokenizer = new Tokenizer("Chuck");
    //               tokenizer.setEntry(pdfString);
    //               // ETO PRE, YUNG INUPLOAD NA FILE NA ICHECHECK
    //               //console.log(tokenizer.getSentences());

    //               // find each documents
    //               try {
    //                 Research.find()
    //                   .sort({ title: 1 })
    //                   .then(researches => {
    //                     let ctr = 0;
    //                     let ctr2 = 0;
    //                     researches.map(research => {
    //                       if (research._id != req.body.researchId) {
    //                         if (research.document != "") {
    //                           ctr++;
    //                         }
    //                       }
    //                     });
    //                     researches.map(research => {
    //                       if (research._id != req.body.researchId) {
    //                         if (research.document != "") {
    //                           fs.readFile(
    //                             `client/public/documents/researchDocuments/${
    //                               research.document
    //                             }`,
    //                             (err, pdfBuffer) => {
    //                               try {
    //                                 new PdfReader().parseBuffer(
    //                                   pdfBuffer,
    //                                   function(err, item) {
    //                                     if (err) {
    //                                       console.log(err);
    //                                     } else if (!item) {
    //                                       const tokenizer = new Tokenizer(
    //                                         "Chuck"
    //                                       );
    //                                       tokenizer.setEntry(pdfStringForAll);
    //                                       documentsArray.push(
    //                                         tokenizer.getSentences()
    //                                       );
    //                                       ctr2++;
    //                                       if (ctr === ctr2) {
    //                                         // ETO PRE, DOCUMENT ARRAY MAY LAMAN LAHAT NUNG TEXTS
    //                                         // console.log(documentsArray);
    //                                       }
    //                                       pdfStringForAll = "";
    //                                     } else if (item.text) {
    //                                       let text = " " + item.text;
    //                                       pdfStringForAll =
    //                                         pdfStringForAll + text;
    //                                     }
    //                                   }
    //                                 );
    //                               } catch (error) {}
    //                             }
    //                           );
    //                         }
    //                       }
    //                     });
    //                   })
    //                   .catch(err =>
    //                     res
    //                       .status(404)
    //                       .json({ noresearchfound: "No Researches found" })
    //                   );
    //               } catch (error) {}
    //             } else if (item.text) {
    //               let text = " " + item.text;
    //               pdfString = pdfString + text;
    //             }
    //           });
    //         } catch (error) {}
    //       }
    //     );
    //   }
    // );
  }
);

// @route   DELETE api/researches/document/:research_id/:filename
// @desc    Delete document from research
// @access  Private
router.delete(
  "/document/:research_id/:filename",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //delete research document from s3
    let s3 = new AWS.S3();

    let params = {
      Bucket: "bulsu-capstone",
      Key: `researchDocuments/${req.params.filename}`
    };

    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
    // try {
    //   fs.unlinkSync(
    //     `client/public/documents/researchDocuments/${req.params.filename}`
    //   );
    // } catch (error) {
    //   console.log(error);
    // }

    const newDocument = {
      document: "",
      lastUpdate: Date.now()
    };

    Research.findOne({ _id: req.params.research_id }).then(research => {
      // add activity
      const newActivity = {
        title: "Document removed from " + research.title
      };
      new Activity(newActivity).save();
    });

    Research.findOneAndUpdate(
      { _id: req.params.research_id },
      { $set: newDocument },
      { new: true }
    ).then(research => res.json(research));
  }
);

// @route   POST api/researches/createReport/researches
// @desc    Generate List of all researches Report
// @access  Private
router.post(
  "/createReport/researches",
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
      .create(pdfResearchesTemplate(req.body), options)
      .toFile("researchesPdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/researches/fetchReport/researches
// @desc    Send the generated pdf to client - list of researches
// @access  Private
router.get(
  "/fetchReport/researches",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/researchesPdf.pdf`);
  }
);

// @route   POST api/researches/createReport/research
// @desc    Generate individual research Report
// @access  Private
router.post(
  "/createReport/research",
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
      .create(pdfResearchTemplate(req.body), options)
      .toFile("researchPdf.pdf", err => {
        if (err) {
          res.send(Promise.reject());
        }
        res.send(Promise.resolve());
      });
  }
);

// @route   GET api/researches/fetchReport/research
// @desc    Send the generated pdf to client - individual research
// @access  Private
router.get(
  "/fetchReport/research",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reqPath = path.join(__dirname, "../../");
    res.sendFile(`${reqPath}/researchPdf.pdf`);
  }
);

// @route   DELETE api/researches/remove/:id
// @desc    Delete research
// @access  Private
router.post(
  "/remove/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let newResearch;
    if (req.body.hidden) {
      newResearch = {
        hidden: 1
      };
    } else {
      newResearch = {
        deleted: 1
      };
    }

    Research.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newResearch },
      { new: true }
    ).then(research => {
      // add activity
      const newActivity = {
        title: req.body.hidden
          ? "Research: " + research.title + " hidden from list"
          : "Research: " + research.title + " moved to bin"
      };
      new Activity(newActivity).save();

      // increase decrease research count in college and course
      College.findOne({ "name.fullName": research.college }).then(college => {
        let researchCount = parseInt(college.researchTotal, 10);
        let newCourse;
        let removeIndex;
        const newCollege = {
          researchTotal: req.body.hidden ? researchCount : --researchCount
        };

        college.course.map((cou, index) => {
          if (cou.name === research.course) {
            newCourse = {
              name: cou.name,
              initials: cou.initials,
              status: cou.status,
              deleted: cou.deleted,
              researchTotal: req.body.hidden
                ? cou.researchTotal
                : --cou.researchTotal,
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
        ).then(research);
      });

      res.json(research);
    });
  }
);

// @route   POST api/research/restore/:id
// @desc    Restore research
// @access  Private
router.post(
  "/restore/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let newResearch;
    if (req.body.hidden) {
      newResearch = {
        hidden: 0
      };
    } else {
      newResearch = {
        deleted: 0
      };
    }

    Research.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newResearch },
      { new: true }
    ).then(research => {
      // add activity
      const newActivity = {
        title: req.body.hidden
          ? "Research: " + research.title + " showed in list"
          : "Research: " + research.title + " restored from bin"
      };
      new Activity(newActivity).save();

      // increase research count in college and course
      College.findOne({ "name.fullName": research.college }).then(college => {
        let researchCount = parseInt(college.researchTotal, 10);
        let newCourse;
        let removeIndex;
        const newCollege = {
          researchTotal: req.body.hidden ? researchCount : ++researchCount
        };

        college.course.map((cou, index) => {
          if (cou.name === research.course) {
            newCourse = {
              name: cou.name,
              initials: cou.initials,
              status: cou.status,
              deleted: cou.deleted,
              researchTotal: req.body.hidden
                ? cou.researchTotal
                : ++cou.researchTotal,
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
        ).then(research);
      });
      res.json(research);
    });
  }
);

module.exports = router;
