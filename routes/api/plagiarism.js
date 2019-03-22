const express = require("express");
const router = express.Router();
const request = require("request");
const fs = require('fs');
const extract = require('pdf-text-extract');
const pdfUtil = require('pdf-to-text');
const download = require("download-pdf");
const pdf = require("html-pdf");
const path = require("path");

const extractor = require('unfluff');
const scraping = require('text-scraping');

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


// Templates
const plagiarismLocalTemplate = require('../../document/plagiarismLocalTemplate');
const plagiarismOnlineTemplate = require('../../document/plagiarismOnlineTemplate');


// FOnt
let fontFooter ="7px";

// @routes  GET api/plagiarism/test
// @desc    Test plagiarism route
// @access  public
router.get("/test", (req, res) => {

  // const oldString = 'a really the. string Interesting string. with. some string. words. thing'
  // const newString = processor.textProcess(oldString);

  // console.log(newString.text);
  // console.log(newString.len);
  
  // pdfUtil.pdfToText(`./routes/downloadedDocu/5c832df01cf56e239472296b.pdf`, function(err, data) {
  //   if (err) throw(err);
  //   //console.log(data); //print all text
  //   let text = processor.textProcess(data.toString().toLowerCase());
  //   let arr = processor.arrayProcess(data.toString().toLowerCase());
  //   console.log(text);
  //   let arrlen = arr.len;
  //   let textlen = text.len;


  //   const lens = {
  //     array: arrlen,
  //     text: textlen
  //   }

  //   res.json({ 
  //     success: true,
  //     data: lens
  //   })
  // });

  // request.get("https://pypi.org/project/aca/", function(error, response, body){

  // //console.log(body)
  // let data = extractor(body)

  // res.send(data)
  //   // const docPath =
  //   //   "https://media.neliti.com/media/publications/68539-EN-the-study-on-the-applicability-of-aho-co.pdf";
  //   // const options = {
  //   //   directory: "./routes/downloadedDocu",
  //   //   filename: "test.pdf"
  //   // };
  //   // download(docPath, options, function(err) {
  //   //   if (err) console.log(err);
  //   //   console.log("Document successfully uploaded.");
  //   //   pdfUtil.pdfToText(`./routes/downloadedDocu/test.pdf`, function(err, data) {
  //   //     res.send(data)
  //   //   });
  //   // });
  //     // data = extractor(body);
  //     // // console.log(data.text);
  //     // console.log(error)
  //     // res.send(data.text);


  // })

  scraping("https://www.linkedin.com/in/cathleen-krishield-urbano-b25347164", function(response) {
    console.log(response)
    let data = response.join('');
    console.log(data.length)
    res.send(data);//Returns text
  });

  // res.json({ msg: "Plagiarism Works!" });
});

// @routes  POST api/plagiarism/online/initialize/pattern
// @desc    initialize online pattern
// @access  public
router.post("/online/initialize/pattern", (req, res) => {
  let pattern = req.body.pattern;

  const {arr, len} = processor.arrayProcess(pattern.toString().toLowerCase());
  plagiarism.initialize(arr, len, "Not Applicable", "Not Applicable");
  res.json({ 
    success: true
  })
  
  
});


// @routes  POST api/plagiarism/online/result
// @desc    search online route
// @access  public
router.post("/online/result", (req, res) => {
  let link = req.body.link;
  let title = req.body.title;
  let mime = req.body.mime;
  let index = req.body.index;
  
  if(mime=="application/pdf"){
    
    const docPath = link;
    const options = {
      directory: "./routes/downloadedDocu/online",
      filename: `${index}.pdf`
    };
    download(docPath, options, function(err) {
      if (err) console.log(err);
      console.log("Document successfully downloaded.");
      pdfUtil.pdfToText(`./routes/downloadedDocu/online/${options.filename}`, function(err, data) {

        
        fs.unlink(`./routes/downloadedDocu/online/${options.filename}`, (err) => {
          if (err) throw err;
          console.log('successfully deleted');
        });

        
        let {text, len} = processor.textProcess(data.toString().toLowerCase());

        let result = plagiarism.search(text, len, title, link);
        
        res.json({
          onlinePlagiarism: {
            success: true,
            data: result
          }
        });
      });
    });
  }else{
    let result = {
      SimilarityScore: 0,
      Document: {
        Pattern: {
          Name: 'Not Applicable',
          Id: 'Not Applicable'
        },
        Text:{
          Name: title,
          Id: link
        }
      },
      Index: []
    }
    

    scraping(link, function(response) {
      let resp = response.join(' ');
      let fortest = response.join('');
      // console.log(data.text);
      
      let newtext = resp
      if(newtext=="" || fortest.length==0){
        res.json({
          onlinePlagiarism: {
            success: true,
            data: result
          }
        });
      }else{
        let {text, len} = processor.textProcess(newtext.toString().toLowerCase());
        result = plagiarism.search(text, len, title, link);
        res.json({
            onlinePlagiarism: {
              success: true,
              data: result
            }
          });
      }
      
      
      // console.log(result);
      // res.json({
      //   onlinePlagiarism: {
      //     success: true,
      //     data: result
      //   }
      // });
      
    });
      
      
      //console.log("KRISHIELD: "+ text);
      
      // let result = plagiarism.search(text, len, title, title);
      // console.log(result);
      //     // res.json({
      //     //   onlinePlagiarism: {
      //     //     success: true,
      //     //     data: result
      //     //   }
      //     // });
      //     //console.log(result);
    
  }
  

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

  let q = req.body.q;

  q = encodeURI(q);

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

  let docuFile = req.body.docuFile;
  const docPath =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" +
        docuFile;

    const options = {
      directory: "./routes/downloadedDocu/",
      filename: docuFile
    };

    download(docPath, options, function(err) {
      if (err) console.log(err);
      console.log("Document successfully downloaded.");
      pdfUtil.pdfToText(`./routes/downloadedDocu/${options.filename}`, function(err, data) {

        
        fs.unlink(`./routes/downloadedDocu/${options.filename}`, (err) => {
          if (err) throw err;
          console.log('successfully deleted');
        });

        res.json({ 
          success: true,
          data: data.toString(),
          docuId
        })
    });
  });

})

// @routes  POST api/extract/pattern
// @desc    extract patter pdf
// @access  public
router.post("/get/text", (req,res) => {
  let docuId = req.body.docuId;

  //option to extract text from page 0 to 10
  var option = {from: 0, to: 10};
  let docuFile = req.body.docuFile;
  const docPath =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" +
        docuFile;

    const options = {
      directory: "./routes/downloadedDocu/",
      filename: docuFile
    };

    download(docPath, options, function(err) {
      if (err) console.log(err);
      console.log("Document successfully downloaded.");
      pdfUtil.pdfToText(`./routes/downloadedDocu/${options.filename}`, function(err, data) {

        
        fs.unlink(`./routes/downloadedDocu/${options.filename}`, (err) => {
          if (err) throw err;
          console.log('successfully deleted');
        });

        res.json({ 
          success: true,
          data: data.toString(),
          textId: docuId
        })
    });
  });

})

// @routes  POST api/local/initialize/pattern
// @desc    extract patter pdf
// @access  public
router.post("/local/initialize/pattern", (req,res) => {
  let docuId = req.body.docuId;
  let title = req.body.title;
  let docuFile = req.body.docuFile;
  const docPath =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" +
        docuFile;

    const options = {
      directory: "./routes/downloadedDocu/",
      filename: docuFile
    };

    download(docPath, options, function(err) {
      if (err) console.log(err);
      console.log("Document successfully downloaded.");
      pdfUtil.pdfToText(`./routes/downloadedDocu/${options.filename}`, function(err, data) {

        
        fs.unlink(`./routes/downloadedDocu/${options.filename}`, (err) => {
          if (err) throw err;
          console.log('successfully deleted');
        });

        let extext = data;
        const {arr, len} = processor.arrayProcess(extext.toString().toLowerCase());
        plagiarism.initialize(arr, len, title, docuId);
        res.json({ 
          success: true
        })
      });
    });

  
})


// @routes  POST api/plagiarism/local
// @desc    search local route
// @access  public
router.post("/local/result", (req, res) => {
  // const { errors, isValid } = validateLocalInput(req.body);
  // //Check Validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  
  
  let textId = req.body.textId;
  let textTitle = req.body.textTitle;
  let textFile = req.body.textFile;

  const docPath =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" +
        textFile;


  const options = {
    directory: "./routes/downloadedDocu/",
    filename: textFile
  };

  download(docPath, options, function(err) {
    if (err) console.log(err);
    console.log("Document successfully downloaded.");
    pdfUtil.pdfToText(`./routes/downloadedDocu/${options.filename}`, function(err, data) {

      
      fs.unlink(`./routes/downloadedDocu/${options.filename}`, (err) => {
        if (err) throw err;
        console.log('successfully deleted');
      });
      let result = {
        SimilarityScore: 0,
        Document: {
          Pattern: {
            Name: '',
            Id: ''
          },
          Text:{
            Name: '',
            Id: ''
          }
        },
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
      let {text, len} = processor.textProcess(data.toString().toLowerCase());
      //console.log(text);
      result = plagiarism.search(text, len, textTitle, textId);
      //const compressed = hm.compress(JSON.stringify(result));
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
      
    });
  });
  
});

router.post('/create/report/local', (req,res) => {
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
  pdf.create(plagiarismLocalTemplate(req.body), options).toFile('PlagiarismLocalResult.pdf', (err) => {
    if(err){
      res.send(Promise.reject())
    }
    res.send(Promise.resolve())
  });

});// end of post

router.get('/get/report/local', (req,res) => {
  let reqPath = path.join(__dirname, "../../");
  res.sendFile(`${reqPath}/PlagiarismLocalResult.pdf`) 
  
});// end of post

router.post('/create/report/local/side', (req,res) => {
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
  pdf.create(plagiarismLocalTemplate(req.body), options).toFile('PlagiarismLocalResult.pdf', (err) => {
    if(err){
      res.send(Promise.reject())
    }
    res.send(Promise.resolve())
  });

});// end of post

router.get('/get/report/local/side', (req,res) => {
  let reqPath = path.join(__dirname, "../../");
  res.sendFile(`${reqPath}/PlagiarismLocalResult.pdf`) 
  
});// end of post


router.post('/create/report/online', (req,res) => {
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
  pdf.create(plagiarismOnlineTemplate(req.body), options).toFile('PlagiarismOnlineResult.pdf', (err) => {
    if(err){
      res.send(Promise.reject())
    }
    res.send(Promise.resolve())
  });

});// end of post

router.get('/get/report/online', (req,res) => {
  let reqPath = path.join(__dirname, "../../");
  res.sendFile(`${reqPath}/PlagiarismOnlineResult.pdf`) 
  
});// end of Get

module.exports = router;
