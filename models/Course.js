const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
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
   college:{
    type: Schema.Types.ObjectId,
    ref: 'colleges'
   }
   

});

module.exports = Course = mongoose.model('courses', CourseSchema)