const Validator = require("validator");
const isEmpty = require("./is-empty");
const striptags = require("striptags");

module.exports = function validateResearchInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";

  data.college = !isEmpty(data.college) ? data.college : "";
  data.volume = !isEmpty(data.volume) ? data.volume : "";
  data.publisher = !isEmpty(data.publisher) ? data.publisher : "";
  data.course = !isEmpty(data.course) ? data.course : "";



  data.yearPublished = !isEmpty(data.yearPublished) ? data.yearPublished : "";
  data.pages = !isEmpty(data.pages) ? data.pages : "";
  data.issn = !isEmpty(data.issn) ? data.issn : "";
  //data.images = !isEmpty(data.images) ? data.images : "";
  data.authorOne = !isEmpty(data.authorOne) ? data.authorOne : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Journal title is required";
  }
  if (Validator.isEmpty(data.volume)) {
    errors.volume = "Journal volume is required";
  }
  if (Validator.isEmpty(data.publisher)) {
    errors.publisher = "Journal publisher is required";
  }

  if (Validator.isEmpty(data.college)) {
    errors.college = "Journal college is required";
  }

  if (Validator.isEmpty(data.course)) {
    errors.course = "Journal course is required";
  }



  if (Validator.isEmpty(data.issn)) {
    errors.issn = "ISSN is required";
  }

  if (Validator.isEmpty(data.yearPublished)) {
    errors.yearPublished = "Year published is required";
  }

  if (Validator.isEmpty(data.pages)) {
    errors.pages = "Journal pages is required";
  }

  if (!Validator.isNumeric(data.pages)) {
    errors.pages = "Journal pages is invalid";
  }

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
