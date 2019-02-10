const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateLocalInput(data) {
    let errors = {};

    data.q = !isEmpty(data.q) ? data.q : '';

    if (Validator.isEmpty(data.q)) {
        errors.q = "Please input text";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}