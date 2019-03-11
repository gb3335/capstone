const Validator = require('validator');
const isEmpty = require('./is-empty');
const passwordValidator = require('password-validator');



module.exports = function validateuserNameInput(data) {
  let errors = {};


  data.userName = !isEmpty(data.userName) ? data.userName : '';
  var schema = new passwordValidator();
  if (schema.is().min(5).is().max(100).validate(data.userName) === false) {
    errors.userName = "Username must atleast 5 characters."
  }
  if (Validator.isEmpty(data.userName)) {
    errors.userName = "Username field is Required";
  }

  console.log(errors)
  return {
    errors,
    isValid: isEmpty(errors)

  }
}