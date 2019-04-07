const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateLocalInput(data) {
    let errors = {};

    data = !isEmpty(data) ? data : '';

    if (!Validator.isLength(data, { min: 200, max: 10000 })) {
        errors.q = "Please input 200 - 10000 characters only.";
    }

    if (Validator.isEmpty(data)) {
        errors.q = "Please input text";
    }

    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}