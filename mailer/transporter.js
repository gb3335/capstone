const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dummykrishield@gmail.com',
    pass: 'krishieldkyle'
  }
});

module.exports = transporter