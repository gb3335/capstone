const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = function validateLocalInput(data) {
    let errors = {};

    data.q = !isEmpty(data.q) ? data.q : '';
    data.text = !isEmpty(data.text) ? data.text : '';
    data.flag = !isEmpty(data.flag) ? data.flag : '';
    data.docu1 = !isEmpty(data.docu1) ? data.docu1 : '';
    data.docu2 = !isEmpty(data.docu2) ? data.docu2 : '';

    if (Validator.isEmpty(data.q)) {
        errors.q = "Please input text";
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = "Please input text";
    }

    if (Validator.isEmpty(data.docu1)) {
        errors.docu1 = "Please input Document 1 name";
    }

    if (Validator.isEmpty(data.docu2)) {
        errors.docu2 = "Please input Document 2 name";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}