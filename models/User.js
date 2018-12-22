const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
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
    userName:{
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    contact: {
        type: String
    },
    userType:{
        type: String,
        required: true
    },
    college:{
        type: Schema.Types.ObjectId,
        ref: 'colleges'
    },
    isBlock:{
        type: Number,
        default: 0
    },
    isLock:{
        type: Number,
        default: 0
    },
    invitedBy:{
        type: String,
        default: "NONE"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('users', UserSchema)