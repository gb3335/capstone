const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAuthorInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  // data.role = !isEmpty(data.role) ? data.role : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Author Name is required";
  }

  // if (Validator.isEmpty(data.role)) {
  //   errors.role = "Author Role is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
