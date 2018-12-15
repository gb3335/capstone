const express = require('express');
const router = express.Router();
const request = require('request');

const ApiKey = 'AIzaSyD0F2qi9T0GNtkgcpaw7Ah7WArFKsTE9pg';
const cx = '014684295069765089744:fvoycnmgzio';

// @routes  GET api/google/test
// @desc    Test google route
// @access  public
router.get('/test', (req, res) => {
    res.json({ msg: "Google Search Works!" })
});

// @routes  POST api/google
// @desc    search google route
// @access  public
router.post('/', (req, res) => {
    const q = req.body.search;
    request.get(`https://www.googleapis.com/customsearch/v1?q=${q}&cx=${cx}&num=10&key=${ApiKey}`,(error, response, body) => {
        if(!error && response.statusCode==200){
            res.json({
                success: true,
                body
            })
        }else{
            return res.status(400).json({
                success: false,
                error : "Something went wrong :( , please contact the developer!"
            });
        }
        
    })
});

module.exports = router;