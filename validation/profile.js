const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
    data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
    data.middlename = !isEmpty(data.middlename) ? data.middlename : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.contact = !isEmpty(data.contact) ? data.contact : '';
    data.username = !isEmpty(data.username) ? data.username : '';
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

    if (!Validator.isNumeric(data.contact) || !Validator.isLength(data.contact, { min: 11, max: 11 })) {
        errors.contact = "Invalid Contact Number";
    }

    if (Validator.isEmpty(data.contact)) {
        errors.contact = "Contact Number field is Required";
    }

    if(data.username.length>0){
        if (!Validator.isLength(data.username, { min: 5, max: 12 })) {
            errors.username = "Username must between 5 to 12 characters";
        }
    }
    
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is Required";
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