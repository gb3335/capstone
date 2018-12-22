const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CollegeSchema = new Schema({
   name:{
       fullName:{
            type: String,
            require: true
       },
       initials:{
        type: String,
        require: true
       }
   },
   logo:{
       type: String,
       required: true
   },
   status: {
       type: Number,
       default: 0
   },
   lastUpdate:{
       date:{
           type: Date,
           default: Date.now
       },
       updateInfo:{
           type: String,
           require: true
       }
   }

});

module.exports = College = mongoose.model('colleges', CollegeSchema)