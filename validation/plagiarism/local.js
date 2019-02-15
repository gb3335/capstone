const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateLocalInput(data) {
    let errors = {};

    data.q = !isEmpty(data.q) ? data.q : '';
    data.text = !isEmpty(data.text) ? data.text : '';

    if (Validator.isEmpty(data.q)) {
        errors.q = "Please input text";
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = "Please input text";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}