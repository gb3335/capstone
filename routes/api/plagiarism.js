const express = require('express');
const router = express.Router();
const request = require('request');

const ApiKey = 'AIzaSyD0F2qi9T0GNtkgcpaw7Ah7WArFKsTE9pg';
const cx = '014684295069765089744:fvoycnmgzio';

 // Load Plagiarism Checker
 const plagiarsim = require('../../plagiarismAlgo/build/Release/plagiarism');

// Load Input Validation
const validateOnlineInput = require('../../validation/plagiarism/online');
const validateLocalInput = require('../../validation/plagiarism/local');

// @routes  GET api/plagiarism/test
// @desc    Test plagiarism route
// @access  public
router.get('/test', (req, res) => {
    res.json({ msg: "Plagiarism Works!" })
});

// @routes  POST api/plagiarism/online
// @desc    search online route
// @access  public
router.post('/online', (req, res) => {

    const { errors, isValid } = validateOnlineInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }


    const q = req.body.q;
    request.get(`https://www.googleapis.com/customsearch/v1?q=${q}&cx=${cx}&num=10&key=${ApiKey}`,(error, response, body) => {
        if(!error && response.statusCode==200){
            res.json({
                onlinePlagiarism: {
                    success: true,
                    data: JSON.parse(body)
                }
            })
        }else{
            res.status(400).json({
                onlinePlagiarism: {
                    success: false,
                    error : "Something went wrong :( , please contact the developer!"
                }
            });
        }
        
    })
});

// @routes  POST api/plagiarism/local
// @desc    search local route
// @access  public
router.post('/local', (req, res) => {


    const { errors, isValid } = validateLocalInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const q = req.body.q;

    let arr = [];
    arr.push(q);

    let result = plagiarsim.search(arr, "a his her");
    res.json({
        localPlagiarism: {
            success: true,
            data: result
        }
    })

    
});

module.exports = router;