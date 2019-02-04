const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateResearchInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.college = !isEmpty(data.college) ? data.college : "";
  data.course = !isEmpty(data.course) ? data.course : "";
  data.abstract = !isEmpty(data.abstract) ? data.abstract : "";
  data.pages = !isEmpty(data.pages) ? data.pages : "";
  //data.images = !isEmpty(data.images) ? data.images : "";
  //data.author = !isEmpty(data.author) ? data.author : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Research title is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Research type is required";
  }

  if (Validator.isNumeric(data.college)) {
    errors.college = "Research college is required";
  }

  if (Validator.isEmpty(data.course)) {
    errors.course = "Research course is required";
  }

  if (Validator.isEmpty(data.abstract)) {
    errors.abstract = "Research abstract is required";
  }

  if (Validator.isEmpty(data.pages)) {
    errors.pages = "Research pages is required";
  }

  // if (Validator.isEmpty(data.images)) {
  //   errors.images = "Research image is required";
  // }

  // if (Validator.isEmpty(data.author)) {
  //   errors.author = "Research author is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
