const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is Required";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is Required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}