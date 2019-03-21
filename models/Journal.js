const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ResearchSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  college: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  issn: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  volume: {
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
  hidden: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Number,
    default: 0
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
        default: "Author"
      }
    }
  ],

  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});


module.exports = Journal = mongoose.model("journal", ResearchSchema);
