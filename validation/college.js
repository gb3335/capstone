const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCollegeInput(data) {
  let errors = {};

  data.fullName = !isEmpty(data.fullName) ? data.fullName : "";
  data.initials = !isEmpty(data.initials) ? data.initials : "";
  data.logo = !isEmpty(data.logo) ? data.logo : "";
  data.librarianName = !isEmpty(data.librarianName) ? data.librarianName : "";

  if (Validator.isEmpty(data.fullName)) {
    errors.fullName = "College Name is required";
  }

  if (Validator.isEmpty(data.initials)) {
    errors.initials = "College Initials is required";
  }

  if (Validator.isNumeric(data.logo)) {
    errors.logo = "College logo is required";
  }

  if (Validator.isEmpty(data.librarianName)) {
    errors.librarian = "College librarian is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
