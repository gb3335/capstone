const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.TRANSPORTER_Email,
    pass: process.env.TRANSPORTER_Password
  }
});

module.exports = transporter