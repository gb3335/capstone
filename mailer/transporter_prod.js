const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.transporterEmail,
    pass: process.env.transporterPassword
  }
});

module.exports = transporter