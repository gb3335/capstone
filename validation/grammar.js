const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateOnlineInput(data) {
    let errors = {};

    data.input = !isEmpty(data.input) ? data.input : '';

    if (Validator.isEmpty(data.input)) {
        errors.input = "Please input text";
    }

    if (!Validator.isLength(data.input, { min: 0, max: 4096 })) {
        errors.length = "Character Length exceeds";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}