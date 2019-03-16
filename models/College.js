const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CollegeSchema = new Schema({
  name: {
    fullName: {
      type: String,
      require: true
    },
    initials: {
      type: String,
      require: true
    }
  },
  librarian: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Number,
    default: 0
  },
  researchTotal: {
    type: String
  },
  journalTotal: {
    type: String
  },
  color: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    date: {
      type: Date,
      default: Date.now
    },
    updateInfo: {
      type: String
    }
  },
  course: [
    {
      name: {
        type: String,
        required: true
      },
      initials: {
        type: String,
        required: true
      },
      status: {
        type: Number,
        default: 0
      },
      deleted: {
        type: Number,
        default: 0
      },
      researchTotal: {
        type: Number,
        default: 0
      },
      journalTotal: {
        type: Number,
        default: 0
      }
    }
  ]
});

module.exports = College = mongoose.model("colleges", CollegeSchema);
