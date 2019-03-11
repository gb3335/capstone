const Validator = require('validator');
const isEmpty = require('./is-empty');
const passwordValidator = require('password-validator');
module.exports = function validateProfileInput(data) {
    let errors = {};

    data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
    data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
    data.middlename = !isEmpty(data.middlename) ? data.middlename : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.contact = !isEmpty(data.contact) ? data.contact : '';
    data.userName = !isEmpty(data.userName) ? data.userName : '';
    data.password = !isEmpty(data.password) ? data.password : '';




    if (Validator.isEmpty(data.firstname)) {
        errors.firstname = "Firstname field is Required";
    }
    if (Validator.isEmpty(data.lastname)) {
        errors.lastname = "Lastname field is Required";
    }
    if (Validator.isEmpty(data.middlename)) {
        errors.middlename = "Middlename field is Required";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is Invalid";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is Required";
    }
    if (Validator.isEmpty(data.userName)) {
        errors.userName = "Username field is Required";
    }
    if (!Validator.isNumeric(data.contact) || !Validator.isLength(data.contact, { min: 11, max: 11 })) {
        errors.contact = "Invalid Contact Number";
    }

    if (Validator.isEmpty(data.contact)) {
        errors.contact = "Contact Number field is Required";
    }



    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is Required";
    }

    var schema = new passwordValidator();


    if (schema.is().min(5).is().max(100).validate(data.userName) === false) {
        errors.userName = "Username must atleast 5 characters."
    }
    if (schema.has().uppercase()
        .has().lowercase()
        .has().digits().validate(data.password) === false) {
        errors.password = "Password must have uppercase and lowercase characters."
    }
    if (schema.is().min(8).is().max(100).validate(data.password) === false) {
        errors.password = "Password must atleast 8 characters."
    }



    // if (Validator.isEmpty(data.password2)) {
    //     errors.password2 = "Confirm Password field is Required";
    // }

    // if (!Validator.equals(data.password, data.password2)) {
    //     errors.password2 = "Passwords must match!";
    // }
    return {
        errors,
        isValid: isEmpty(errors)

    }
}