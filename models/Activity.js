const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ActivitySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  by: {
    type: String
  }
});

module.exports = Activity = mongoose.model("activities", ActivitySchema);
