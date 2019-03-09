const express = require("express");
const router = express.Router();
const request = require("request");
const fs = require('fs');
const extract = require('pdf-text-extract')

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

  // //option to extract text from page 0 to 10
  // const option = {from: 0, to: 10};
  
  // //Omit option to extract all text from the pdf file
  // pdfUtil.pdfToText(`./routes/downloadedDocu/${docuId}.pdf`, function(err, data) {
  //   if (err) throw(err);
  //   console.log(data); //print all text    
  // });

  // let extext=""
  // fs.readFile(`./routes/downloadedDocu/${docuId}.pdf`, (err, pdfBuffer) => {
  //   // pdfBuffer contains the file content
  //   new PdfReader().parseBuffer(pdfBuffer, function(err, item){
  //     if (err)
  //       callback(err);
  //     else if (!item)
  //       callback();
  //     else if (item.text)
  //       extext = item.text;
  //       //extext = extext.toString().split("\n").join("");
  //       console.log(extext)
        
  //     });
  // });
  let extext = "kyle"
  extract(`./routes/downloadedDocu/${docuId}.pdf`, { splitPages: false }, (err, data) => {
    if (err) {
      console.dir(err)
      return
    }
    extext = data;
    //extext = processor.textProcess(extext.toString().toLowerCase());
    //console.log(extext)
    //let wer = "kyle"
    let arr = processor.arrayProcess("extext".toString().toLowerCase());
    let text = processor.textProcess(extext.toString().toLowerCase());
    let flag = req.body.flag;
    if(flag=="true"){
      flag=true;
    }else{
      flag=false;
    }
    let docu1 = req.body.docu1;
    let docu2 = req.body.docu2;

    let result = plagiarism.search(arr, text, true, "docu1", "docu2");
    res.json({
      localPlagiarism: {
        success: true,
        data: result
      }
    });
    
  })

  
  

  // let dataBuffer = fs.readFileSync(`./routes/downloadedDocu/${docuId}.pdf`);
 
  // pdf(dataBuffer).then(function(data) {
  
  //     // number of pages
  //     console.log(data.numpages);
  //     // number of rendered pages
  //     console.log(data.numrender);
  //     // PDF info
  //     console.log(data.info);
  //     // PDF metadata
  //     console.log(data.metadata); 
  //     // PDF.js version
  //     // check https://mozilla.github.io/pdf.js/getting_started/
  //     console.log(data.version);
  //     // PDF text
  //     console.log(data.text); 
          
  // })
  // .catch(function(error){
  //   // handle exceptions
  //   console.log(error)
  // })


  
  
});

module.exports = router;
