const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCourseInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.initials = !isEmpty(data.initials) ? data.initials : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Course Name is required";
  }

  if (Validator.isEmpty(data.initials)) {
    errors.initials = "Course Initials is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
