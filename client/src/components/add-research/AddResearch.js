import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { Tesseract } from "tesseract.ts";

import "react-quill/dist/quill.snow.css";

import { createResearch } from "../../actions/researchActions";
import { getColleges } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

class AddResearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "",
      college: "",
      course: "",
      abstract: "",
      researchId: "",
      pages: "",
      schoolYear: "",
      courseOptions: [{ label: "* Select Course", value: "" }],
      errors: {},
      ocrProgress: ""
    };
  }

  componentDidMount() {
    this.props.getColleges();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const researchData = {
      title: this.state.title,
      type: this.state.type,
      college: this.state.college,
      course: this.state.course,
      abstract: this.state.abstract,
      researchId: this.state.researchId,
      schoolYear: this.state.schoolYear,
      pages: this.state.pages
    };

    this.refs.resBtn.setAttribute("disabled", "disabled");
    this.props.createResearch(researchData, this.props.history);
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
            course.deleted === 0 || course.status === 1
              ? this.state.courseOptions.push({
                  label: course.name,
                  value: course.name
                })
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
    this.setState({ abstract: value });
    this.refs.resBtn.removeAttribute("disabled");
  };

  onOCR = e => {
    let files = e.target.files;

    Tesseract.recognize(files[0])
      .progress(data => {
        //console.log(data.status);
        this.setState({
          ocrProgress: data.status + " at " + data.progress * 100 + "%"
        });
      })
      .then(data => {
        //console.log(data.text);
        this.setState({ abstract: data.text });
      })
      .catch(console.error);
  };

  render() {
    const { college, errors } = this.props;
    const progress = this.state.ocrProgress;
    let collegeOptions = [{ label: "* Select College", value: "" }];

    try {
      college.colleges.map(college =>
        college.deleted === 0
          ? collegeOptions.push({
              label: college.name.fullName,
              value: college.name.fullName
            })
          : ""
      );
    } catch (error) {}

    return (
      <div className="create-research">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/researches" className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Researches
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Add Research</h1>
              <p className="lead text-center">
                Let's get some information for your research
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <div className="form-group" style={{ textAlign: "center" }}>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="inlineRadio1"
                      value="thesis"
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Thesis
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="inlineRadio2"
                      value="undergrad"
                      onChange={this.onChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      Undergrad Research
                    </label>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#d9534f", fontSize: 13 }}>
                    {errors.type}
                  </p>
                </div>
                <br />
                <TextFieldGroup
                  placeholder="* Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                  info="Add your research title"
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
                  <p style={{ fontSize: "12px" }}>{progress}</p>
                </div>
                <ReactQuill
                  style={{ height: "20rem" }}
                  placeholder="* Abstract"
                  value={this.state.abstract}
                  onChange={this.handleChange}
                />

                <br />
                <br />
                <br />
                <div>
                  <p style={{ color: "#d9534f", fontSize: 13 }}>
                    {errors.abstract}
                  </p>
                </div>
                <TextFieldGroup
                  placeholder="* Research ID"
                  name="researchId"
                  value={this.state.researchId}
                  onChange={this.onChange}
                  error={errors.researchId}
                  info="Research ID give by the college library"
                />
                <TextFieldGroup
                  placeholder="* Pages"
                  name="pages"
                  value={this.state.pages}
                  onChange={this.onChange}
                  error={errors.pages}
                  info="Number of pages in your research"
                />
                <TextFieldGroup
                  placeholder="* School Year"
                  name="schoolYear"
                  value={this.state.schoolYear}
                  onChange={this.onChange}
                  error={errors.schoolYear}
                  info="Academic Year you've finished the research"
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
AddResearch.propTypes = {
  getColleges: PropTypes.func.isRequired,
  createResearch: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { createResearch, getColleges }
)(withRouter(AddResearch));
