const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const generator = require('generate-password');

//Load input Validation
const validateRegisterInput = require('../../validation/register');
const validateEmailRegisterInput = require('../../validation/emailregister');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User')
// Load Invitation Model
const Invitation = require('../../models/Invitations')

// Load Transport Email
const Transporter = require('../../mailer/transporter');

// @routes  GET api/users/test
// @desc    Test users route
// @access  public
router.get('/test', (req, res) => {
    res.json({ msg: "Users Works!" })
});

generatePassword =()=>{
    return password = generator.generate({
        length: 10,
        numbers: true
    });
}

// @routes  POST api/users/register
// @desc    Register a User
// @access  public
router.post('/register', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            errors.email = 'Email Already Exists!';
            return res.status(400).json(errors);
        }else{
            const password = generatePassword();

            const newUser = new User({
                name: {
                    firstName: req.body.firstname,
                    middleName: req.body.middlename,
                    lastName: req.body.lastname
                },
                email: req.body.email,
                password,
                avatar: "../../images/user.png",
                contact: req.body.contact,
                userType: req.body.usertype
            });

            const mailOptions ={
                from: 'dummykrishield@gmail.com',
                to: req.body.email,
                subject: 'Bulacan State University',
                text: (`You are invited to be ${req.body.usertype} in Bulacan State University by ${req.user.name.firstName} ${req.user.name.lastName}
                
                Login to <todo link>
                Email: ${req.body.email}
                Password: ${password}
                `)
            }
            Transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    errors.sendemail = "Sending Email Failed!"
                    return res.status(400).json(errors);
                } else {
                    success.sendemail = "Invitation Successfully Sent!"
                }
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
    })
    });


// @routes  POST api/users/login
// @desc    Login User /Returning JWT Token
// @access  public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const userName = req.body.username;
    const password = req.body.password;

    //FIND THE USER BY USERNAME
    User.findOne({ userName })
        .then(user => {
            //Check for User
            if (!user) {
                User.findOne({email:userName})
                    .then(user => {
                        if(!user){
                            errors.username = 'User not found!';
                            return res.status(404).json(errors)
                        }else{
                            //Check password
                            bcrypt.compare(password, user.password)
                            .then(isMatch => {
                                if (isMatch) {
                                    //User Match!

                                    const payload = { id: user._id, userName: user.userName, email:user.email, contact: user.contact, firstName: user.name.firstName, middleName: user.name.middleName, lastName: user.name.lastName,avatar: user.avatar, userType: user.userType, isLock: user.isLock } //Create JWT Payload
                                    //Sign the Token
                                    jwt.sign(payload, keys.secretOrKey, (err, token) => {
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token
                                        });
                                    });
                                } else {
                                    errors.password = 'Password Incorrect!';
                                    return res.status(400).json(errors);
                                }
                            })
                        }
                    })
            }else{
                //Check password
                bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User Match!

                        const payload = { id: user._id, userName: user.userName, email:user.email, contact: user.contact, firstName: user.name.firstName, middleName: user.name.middleName, lastName: user.name.lastName,avatar: user.avatar, userType: user.userType, isLock: user.isLock } //Create JWT Payload

                        //Sign the Token
                        jwt.sign(payload, keys.secretOrKey, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                    } else {
                        errors.password = 'Password Incorrect!';
                        return res.status(400).json(errors);
                    }
                })
            }
        });
});

// @routes  GET api/users/current
// @desc    Return Current User
// @access  private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        userName:req.user.userName,
        email: req.user.email,
        userType: req.user.userType
    });
});




module.exports = router