const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePasswordInput(data) {
    let errors = {};

    
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.newpassword = !isEmpty(data.newpassword) ? data.newpassword : '';


    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is Required";
    }


    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match!";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm Password field is Required";
    }

    if (!Validator.isLength(data.newpassword, { min: 6, max: 30 })) {
        errors.newpassword = "New Password must be at least 6 characters";
    }

    if (Validator.isEmpty(data.newpassword)) {
        errors.newpassword = "New Password is Required";
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}