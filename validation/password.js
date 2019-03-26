const Validator = require('validator');
const isEmpty = require('./is-empty');
const passwordValidator = require('password-validator');

var schema = new passwordValidator();

module.exports = function validatePasswordInput(data) {
    let errors = {};


    data.password = !isEmpty(data.password) ? data.password : '';
    data.newpassword = !isEmpty(data.newpassword) ? data.newpassword : '';
    data.newpassword2 = !isEmpty(data.newpassword2) ? data.newpassword2 : '';

    if (schema.has().uppercase()
        .has().lowercase()
        .has().digits().validate(data.newpassword) === false) {
        errors.newpassword = "Password must have uppercase and lowercase and numerical characters."
    };
    if (schema.has().uppercase()
        .has().lowercase()
        .has().digits().validate(data.newpassword2) === false) {
        errors.newpassword2 = "Password must have uppercase and lowercase and numerical characters."
    };


    if (!Validator.isLength(data.newpassword, { min: 6, max: 30 })) {
        errors.newpassword = "New Password must be at least 6 characters";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.newpassword = "New Password must be at least 6 characters";
    }
    if (!Validator.isLength(data.newpassword2, { min: 6, max: 30 })) {
        errors.newpassword = "New Password must be at least 6 characters";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is Required";
    }
    if (Validator.isEmpty(data.newpassword)) {
        errors.newpassword = "New Password is Required";
    }
    if (Validator.isEmpty(data.newpassword)) {
        errors.newpassword2 = "Confirm Password is Required";
    }

    if (!Validator.equals(data.newpassword, data.newpassword2)) {
        errors.newpassword2 = "Passwords must match!";
        errors.newpassword = "Passwords must match!";
    }






    return {
        errors,
        isValid: isEmpty(errors)
    }
}