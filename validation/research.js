const Validator = require("validator");
const isEmpty = require("./is-empty");
const striptags = require("striptags");

module.exports = function validateResearchInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";

  data.college = !isEmpty(data.college) ? data.college : "";
  data.course = !isEmpty(data.course) ? data.course : "";
  data.abstract = !isEmpty(data.abstract) ? data.abstract : "";
  data.schoolYear = !isEmpty(data.schoolYear) ? data.schoolYear : "";
  // data.pages = !isEmpty(data.pages) ? data.pages : "";
  data.researchId = !isEmpty(data.researchId) ? data.researchId : "";
  //data.images = !isEmpty(data.images) ? data.images : "";
  data.authorOne = !isEmpty(data.authorOne) ? data.authorOne : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Research title is required";
  }

  if (Validator.isEmpty(data.college)) {
    errors.college = "Research college is required";
  }

  if (Validator.isEmpty(data.course)) {
    errors.course = "Research course is required";
  }

  if (Validator.isEmpty(data.abstract)) {
    errors.abstract = "Research abstract is required";
  }

  if (!Validator.isLength(striptags(data.abstract), { min: 100 })) {
    errors.abstract = "Abstract must be at least 100 characters";
  }

  if (Validator.isEmpty(data.researchId)) {
    errors.researchId = "Research ID is required";
  }

  if (Validator.isEmpty(data.schoolYear)) {
    errors.schoolYear = "School year is required";
  }

  // if (Validator.isEmpty(data.pages)) {
  //   errors.pages = "Research pages is required";
  // }

  // if (!Validator.isNumeric(data.pages)) {
  //   errors.pages = "Research pages is invalid";
  // }

  if (Validator.isEmpty(data.authorOne)) {
    errors.authorOne = "Author One is required";
  }
  // if (Validator.isEmpty(data.images)) {
  //   errors.images = "Research image is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
