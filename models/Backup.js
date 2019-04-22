const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BackupSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  folder: {
    type: String
  },
  requested:{
    type: Number,
    default:0
  },
  available: {
    type: Number,
    default:0
  },
  date: {
    type: Date,
    default: Date.now
  },
  by: {
    type: String
  }
});

module.exports = Backup = mongoose.model("backups", BackupSchema);
