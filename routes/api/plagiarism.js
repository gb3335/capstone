const express = require("express");
const router = express.Router();
const request = require("request");
const fs = require('fs');
const extract = require('pdf-text-extract');
const pdfUtil = require('pdf-to-text');

const {gzip, ungzip} = require('node-gzip');
const jsscompress = require("js-string-compression");
const hm = new jsscompress.Hauffman();

const ApiKey = "AIzaSyD0F2qi9T0GNtkgcpaw7Ah7WArFKsTE9pg";
const cx = "014684295069765089744:fvoycnmgzio";

// Load Plagiarism Checker
const plagiarism = require("../../krishield-kyle-plagiarism");

// Text Processor
const processor = require('../../validation/plagiarism/processor');

// Load Input Validation
const validateOnlineInput = require("../../validation/plagiarism/online");
const validateLocalInput = require("../../validation/plagiarism/local");

// @routes  GET api/plagiarism/test
// @desc    Test plagiarism route
// @access  public
router.get("/test", (req, res) => {
  res.json({ msg: "Plagiarism Works!" });
});

// @routes  POST api/plagiarism/online
// @desc    search online route
// @access  public
router.post("/online", (req, res) => {
  const { errors, isValid } = validateOnlineInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const q = req.body.q;
  request.get(
    `https://www.googleapis.com/customsearch/v1?q=${q}&cx=${cx}&num=10&key=${ApiKey}`,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.json({
          onlinePlagiarism: {
            success: true,
            data: JSON.parse(body)
          }
        });
      } else {
        res.status(400).json({
          onlinePlagiarism: {
            success: false,
            error: "Something went wrong :( , please contact the developer!"
          }
        });
      }
    }
  );
});

// @routes  POST api/extract/pattern
// @desc    extract patter pdf
// @access  public
router.post("/get/pattern", (req,res) => {
  let docuId = req.body.docuId;

  //option to extract text from page 0 to 10
  var option = {from: 0, to: 10};
  
  //Omit option to extract all text from the pdf file
  pdfUtil.pdfToText(`./routes/downloadedDocu/${docuId}.pdf`, function(err, data) {
    if (err) throw(err);
    //console.log(data); //print all text
    res.json({ 
      success: true,
      data: data.toString()
    })
  });

})


// @routes  POST api/extract/pattern
// @desc    extract patter pdf
// @access  public
router.post("/initialize/pattern", (req,res) => {
  let docuId = req.body.docuId;
  pdfUtil.pdfToText(`./routes/downloadedDocu/${docuId}.pdf`, function(err, data) {
    if (err) {
      console.dir(err)
      return
    }
    
    let extext = data;
    extext = processor.arrayProcess(extext.toString().toLowerCase());
    plagiarism.initialize(extext);
    res.json({ 
      success: true
    })
  })
})


// @routes  POST api/plagiarism/local
// @desc    search local route
// @access  public
router.post("/local", (req, res) => {
  // const { errors, isValid } = validateLocalInput(req.body);
  // //Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  let docuId = req.body.docuId;
  let title = req.body.title;
  let textId = req.body.textId;
  let textTitle = req.body.textTitle;
  
  pdfUtil.pdfToText(`./routes/downloadedDocu/${textId}.pdf`, function(err, data2) {
        let result = {
          SimilarityScore: 0,
          DocumentScore: {
            Document_1: {
              Name: "",
              Score: 0
            },
            Document_2: {
              Name: "",
              Score: 0
            }
          },
          NumOfHits: 0,
          NumOfPattern: 0,
          NumOfText: 0,
          Index: []
        }
        if (err) {
          console.dir(err)
          res.json({
            localPlagiarism: {
              success: false,
              data: result
            }
          });
        }
        let text = processor.textProcess(data2.toString().toLowerCase());
        
        result = plagiarism.search(text, title, textTitle);
        if(result.SimilarityScore == 100){
          delete result.Index;
        }
        const compressed = hm.compress(JSON.stringify(result));
        // gzip(JSON.stringify(result))
        // .then((compressed) => {
        //   console.log(compressed);
        //   //return ungzip(compressed);
        //   res.json({
        //     localPlagiarism: {
        //       success: true,
        //       data: compressed
        //     }
        //   });
        // })
        // .then((decompressed) => {
        //   console.log(JSON.parse(decompressed)); 
        // });
        res.json({
          localPlagiarism: {
            success: true,
            data: result
          }
        });
      })
  
});

module.exports = router;
