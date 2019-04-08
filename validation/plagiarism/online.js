const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateOnlineInput(data) {
    let errors = {};

    data = !isEmpty(data) ? data : '';

    if (!Validator.isLength(data, { min: 100, max: 2500 })) {
        errors.q = "Please input 100 - 2500 characters only.";
    }

    if (Validator.isEmpty(data)) {
        errors.q = "Please input text";
    }

    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}