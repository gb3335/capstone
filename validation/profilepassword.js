const Validator = require('validator');
const isEmpty = require('./is-empty');
const passwordValidator = require('password-validator');



module.exports = function validatepasswordInput(data) {
  let errors = {};


  data.password = !isEmpty(data.password) ? data.password : '';
  data.password1 = !isEmpty(data.password1) ? data.password1 : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (data.password1 != data.password2) {
    errors.password1 = "Password do not match.";

  }
  if (data.password1 != data.password2) {
    errors.password2 = "Password do not match.";

  }


  var schema = new passwordValidator();

  if (schema.has().uppercase()
    .has().lowercase()
    .has().digits().validate(data.password1) === false) {
    errors.password1 = "Password must have uppercase and lowercase characters."
  };
  if (schema.is().min(8).is().max(100).validate(data.password1) === false) {
    errors.password1 = "Password must atleast 8 characters."
  };

  if (schema.has().uppercase()
    .has().lowercase()
    .has().digits().validate(data.password2) === false) {
    errors.password2 = "Password must have uppercase and lowercase characters."
  };
  if (schema.is().min(8).is().max(100).validate(data.password2) === false) {
    errors.password2 = "Password must atleast 8 characters."
  };

  if (schema.has().uppercase()
    .has().lowercase()
    .has().digits().validate(data.password) === false) {
    errors.password = "Password must have uppercase and lowercase characters."
  };
  if (schema.is().min(8).is().max(100).validate(data.password) === false) {
    errors.password = "Password must atleast 8 characters."
  };

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is Required";
  }
  if (Validator.isEmpty(data.password1)) {
    errors.password1 = "Password field is Required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Password field is Required";
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