import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { Tesseract } from "tesseract.ts";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

import "react-quill/dist/quill.snow.css";

import { createJournal } from "../../actions/journalActions";
import { getColleges } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

class AddJournal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      publisher: "",
      volume: "",
      college: "",
      course: "",
      description: "",
      issn: "",
      authorOne: "",
      pages: "",
      yearPublished: "",
      flagFromCollege: false,
      courseOptions: [{ label: "* Select Course", value: "" }],
      errors: {},
      ocrProgress: "",
      progress: 0,
      ocrDisableFlag: false
    };
  }

  componentDidMount() {
    this.props.getColleges();

    try {
      const { courseData } = this.props.location;

      this.props.college.colleges.map(college =>
        college.name.fullName === courseData.collegeName
          ? college.course.map(course =>
              course.deleted === 0
                ? course.status === 0
                  ? this.state.courseOptions.push({
                      label: course.name,
                      value: course.name
                    })
                  : ""
                : ""
            )
          : ""
      );

      this.setState({ course: courseData.courseName });
      this.setState({ college: courseData.collegeName });
      this.setState({ flagFromCollege: courseData.fromCollege });
    } catch (error) {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const name = this.props.auth.user.id;

    const replaceString = require("replace-string");

    let a = this.state.description;
    let b = replaceString(a, "<p>", "");
    let c = replaceString(b, "</p>", "");
    require("str-trim");
    let d = c.trim();
    let mystring;
    if (d.length === 0) {
      mystring = "";
    } else {
      mystring = this.state.description;
    }
    const journalData = {
      title: this.state.title,
      volume: this.state.volume,
      publisher: this.state.publisher,
      college: this.state.college,
      course: this.state.course,
      description: mystring,
      issn: this.state.issn,
      yearPublished: this.state.yearPublished,
      pages: this.state.pages,
      authorOne: this.state.authorOne,
      username: name
    };

    this.refs.resBtn.setAttribute("disabled", "disabled");
    this.props.createJournal(journalData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute("disabled");
  };

  onChangeSelect = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute("disabled");

    this.state.courseOptions.length = 0;
    this.state.courseOptions.push({
      label: "* Select Course",
      value: ""
    });

    this.props.college.colleges.map(college =>
      college.name.fullName === e.target.value
        ? college.course.map(course =>
            course.deleted === 0
              ? course.status === 0
                ? this.state.courseOptions.push({
                    label: course.name,
                    value: course.name
                  })
                : ""
              : ""
          )
        : ""
    );
  };

  onChangeSelectCourse = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute("disabled");
  };

  handleChange = value => {
    this.setState({ description: value });
    this.refs.resBtn.removeAttribute("disabled");
  };

  onOCR = e => {
    let files = e.target.files;

    Tesseract.recognize(files[0])
      .progress(data => {
        let dataProg = data.progress * 100;
        dataProg = dataProg.toString();
        dataProg = dataProg.substring(0, 5);

        this.setState({
          ocrProgress: data.status + "...",
          progress: dataProg,
          ocrDisableFlag: true
        });
      })
      .then(data => {
        this.setState({ description: data.text, ocrDisableFlag: false });
      })
      .catch(console.error);
  };

  render() {
    const { college, errors } = this.props;
    const progress = this.state.ocrProgress;
    let collegeOptions = [{ label: "* Select College", value: "" }];

    try {
      if (this.props.auth.user.userType === "LIBRARIAN") {
        college.colleges.map(college =>
          college.deleted === 0
            ? college.name.fullName === this.props.auth.user.college
              ? collegeOptions.push({
                  label: college.name.fullName,
                  value: college.name.fullName
                })
              : ""
            : ""
        );
      } else {
        college.colleges.map(college =>
          college.deleted === 0
            ? collegeOptions.push({
                label: college.name.fullName,
                value: college.name.fullName
              })
            : ""
        );
      }
    } catch (error) {}

    return (
      <div className="create-research">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link
                to={
                  this.state.flagFromCollege
                    ? `/colleges/${college.college.name.initials}`
                    : "/journals"
                }
                className="btn btn-light mb-3 float-left"
              >
                <i className="fas fa-angle-left" />{" "}
                {this.state.flagFromCollege
                  ? `Back to ${college.college.name.initials}`
                  : "Back to Journal"}
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Add Journal</h1>
              <p className="lead text-center">
                Let's get some information for your journal
              </p>
              <small className="d-block pb-3">* required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                  info="Add your journal title"
                />
                <div className="row">
                  <div className="col-md-6">
                    <SelectListGroup
                      placeholder="College"
                      name="college"
                      value={this.state.college}
                      onChange={this.onChangeSelect}
                      options={collegeOptions}
                      error={errors.college}
                      info="Select your college"
                    />
                  </div>
                  <div className="col-md-6">
                    <SelectListGroup
                      placeholder="Course"
                      name="course"
                      value={this.state.course}
                      onChange={this.onChangeSelectCourse}
                      options={this.state.courseOptions}
                      error={errors.course}
                      info="Select your course"
                    />
                  </div>
                </div>

                <div>
                  {this.state.ocrDisableFlag ? (
                    <label
                      to="#"
                      className="btn btn-light"
                      style={{ fontSize: "12px", cursor: "no-drop" }}
                      title="Use Image to Text"
                    >
                      <i className="fas fa-file-image mr-1" />
                      Image to Text
                    </label>
                  ) : (
                    <label
                      to="#"
                      htmlFor="ocr"
                      className="btn btn-light"
                      style={{ fontSize: "12px" }}
                      title="Use Image to Text"
                    >
                      <i className="fas fa-file-image mr-1" />
                      Image to Text
                    </label>
                  )}
                  <input
                    type="file"
                    style={{
                      border: 0,
                      opacity: 0,
                      position: "absolute",
                      pointerEvents: "none",
                      width: "1px",
                      height: "1px"
                    }}
                    onChange={this.onOCR}
                    name="name"
                    id="ocr"
                    accept=".png, .jpg, .jpeg"
                  />
                  {progress.length >= 1 ? (
                    <div style={{ fontSize: "14px" }}>
                      {progress}
                      <Progress percent={this.state.progress} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <ReactQuill
                  style={{ height: "20rem" }}
                  placeholder="* Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />

                <br />
                <br />
                <br />
                <div>
                  <p style={{ color: "#d9534f", fontSize: 13 }}>
                    {errors.description}
                  </p>
                </div>
                <TextFieldGroup
                  placeholder="* Volume"
                  name="volume"
                  value={this.state.volume}
                  onChange={this.onChange}
                  error={errors.volume}
                  info="Volume the journal"
                />
                <TextFieldGroup
                  placeholder="* Author One"
                  name="authorOne"
                  value={this.state.authorOne}
                  onChange={this.onChange}
                  error={errors.authorOne}
                  info="Author One of the journal"
                />
                <TextFieldGroup
                  placeholder="* Publisher"
                  name="publisher"
                  value={this.state.publisher}
                  onChange={this.onChange}
                  error={errors.publisher}
                  info="Publisher of the journal"
                />
                <TextFieldGroup
                  placeholder="* ISSN"
                  name="issn"
                  value={this.state.issn}
                  onChange={this.onChange}
                  error={errors.issn}
                  info="ISSN given by the college library"
                />
                {/* <TextFieldGroup
                  placeholder="* Pages"
                  name="pages"
                  value={this.state.pages}
                  onChange={this.onChange}
                  error={errors.pages}
                  info="Number of pages in your journal"
                /> */}
                <TextFieldGroup
                  placeholder="* Published year"
                  name="yearPublished"
                  value={this.state.yearPublished}
                  onChange={this.onChange}
                  error={errors.yearPublished}
                  info="Year you've published the journal"
                />
                <input
                  ref="resBtn"
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AddJournal.propTypes = {
  getColleges: PropTypes.func.isRequired,
  createJournal: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { createJournal, getColleges }
)(withRouter(AddJournal));
