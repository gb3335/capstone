const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ResearchSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  type: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  pages: {
    type: String,
    required: true
  },
  schoolYear: {
    type: String,
    required: true
  },
  images: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ],
  document: {
    type: String,
    required: false
  },
  author: [
    {
      name: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      }
    }
  ],
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Research = mongoose.model("research", ResearchSchema);
