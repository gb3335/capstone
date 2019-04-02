const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserLogSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  name: {
    firstName: {
      type: String,
      required: true
    },
    middleName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  contact: {
    type: String,
    required: true
  },
  userType: {
    type: String
  },
  college: {
    type: String,
  },
  avatar: {
    type: String,
    default: './default.jpg'
  },
  isBlock: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },

});

module.exports = UserLog = mongoose.model("userlogs", UserLogSchema);
