const express = require("express");
const router = express.Router();
const request = require("request");

const Grammarbot = require('grammarbot');

// Load Input Validation
const validateGrammarInput = require("../../validation/grammar");

// APIKEY textgear
const key = 'ARfXPtrNA37emBC3'

// API KEY grammarbot

const bot = new Grammarbot({
    'api_key' : 'AF5B9M2X',      // (Optional) defaults to node_default
    'language': 'en-US',         // (Optional) defaults to en-US
    'base_uri': 'api.grammarbot.io', // (Optional) defaults to api.grammarbot.io
});

router.get('/test', (req,res) => {
    res.send("grammar works");
})

router.post('/', (req,res) => {
    const { errors, isValid } = validateGrammarInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    
    let text = req.body.input
    // request.post('https://api.textgears.com/check.php',{form:{text, key}}, (error, response, body) => {
    //     if(!error && response.statusCode == 200){
    //         res.json({
    //             grammar: {
    //                 success: true,
    //                 data: JSON.parse(body)
    //             }
    //         });
    //     }else{
    //         res.status(400).json({
    //             grammar: {
    //               success: false,
    //               error: "Something went wrong :( , please contact the developer!"
    //             }
    //           });
    //     }
    // })

    bot.check(text, function(error, result) {
        if (!error){
            res.json({
                grammar: {
                    success: true,
                    data: result
                }
            });
        } 

      });

})


module.exports = router;