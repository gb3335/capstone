const express = require("express");
const router = express.Router();
const request = require("request");
const PdfReader = require('pdfreader').PdfReader;
const fs = require("fs");
var download = require('download-pdf')

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
  let document = req.body.document;

  const docPath = "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" + document;
  
    const options = {
        directory: "./routes/downloadedDocu"
    }
    
    download(docPath, options, function(err){
        if (err) throw err
        console.log("meow")
        fs.readFile(`./routes/downloadedDocu/${document}`, (err, pdfBuffer) => {
          // pdfBuffer contains the file content
          new PdfReader().parseBuffer(pdfBuffer, function(err, item){
            if (err)
              callback(err);
            else if (!item)
              callback();
            else if (item.text)
              console.log(item.text);
            });
        });
    }) 

  
    
    

    // new PdfReader().parseFileItems(docPath, function(err, item) {
    //   if (err){
    //     console.log("Error: "+ err)
    //   }
    //   else if (!item){
    //     console.log("No item")
    //   }
    //   else if (item.text){ console.log(item.text)};
    // });
  // let arr = processor.arrayProcess(req.body.q.toLowerCase());
  // let text = processor.textProcess(req.body.text.toLowerCase());
  // let flag = req.body.flag;
  // if(flag=="true"){
  //   flag=true;
  // }else{
  //   flag=false;
  // }
  // let docu1 = req.body.docu1;
  // let docu2 = req.body.docu2;

  // let result = plagiarism.search(arr, text, flag, docu1, docu2);
  // res.json({
  //   localPlagiarism: {
  //     success: true,
  //     data: result
  //   }
  // });
});

module.exports = router;
