import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { createResearch } from "../../actions/researchActions";
import { getColleges } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

class EditResearch extends Component {
  constructor(props) {
    super(props);

    const research = this.props.research.research;

    this.state = {
      title: research.title,
      type: research.type,
      college: research.college,
      course: research.course,
      abstract: research.abstract,
      pages: research.pages,
      errors: {}
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
      pages: this.state.pages,
      id: this.props.research.research._id
    };

    this.refs.resBtn.setAttribute("disabled", "disabled");
    this.props.createResearch(researchData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute("disabled");
  };

  handleChange = value => {
    this.setState({ abstract: value });
  };

  quillChange = () => {
    this.refs.resBtn.removeAttribute("disabled");
  };

  render() {
    const { college, errors } = this.props;
    const path = "/researches/" + this.props.research.research._id;
    let collegeOptions = [{ label: "* Select College", value: "" }];
    let courseOptions = [{ label: "* Select Course", value: "" }];

    college.colleges.map(college =>
      collegeOptions.push({
        label: college.name.fullName,
        value: college.name.fullName
      })
    );

    college.colleges.map(college =>
      college.course.map(course => {
        courseOptions.push({
          label: course.name,
          value: course.name
        });
      })
    );

    return (
      <div className="create-research">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={path} className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Research
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Edit Research</h1>
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
                      checked={this.state.type === "thesis"}
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
                      checked={this.state.type === "undergrad"}
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
                      onChange={this.onChange}
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
                      onChange={this.onChange}
                      options={courseOptions}
                      error={errors.course}
                      info="Select your course"
                    />
                  </div>
                </div>
                <ReactQuill
                  style={{ height: "20rem" }}
                  placeholder="* Abstract"
                  value={this.state.abstract}
                  onChange={this.handleChange}
                  onKeyPress={this.quillChange}
                />
                <br />
                <br />
                <div>
                  <p style={{ color: "#d9534f", fontSize: 13 }}>
                    {errors.abstract}
                  </p>
                </div>
                {/* <TextAreaFieldGroup
                  placeholder="* Abstract"
                  name="abstract"
                  value={this.state.abstract}
                  onChange={this.onChange}
                  error={errors.abstract}
                  info="Abstract of the research"
                  rows="10"
                /> */}
                <TextFieldGroup
                  placeholder="* Pages"
                  name="pages"
                  value={this.state.pages}
                  onChange={this.onChange}
                  error={errors.pages}
                  info="Number of pages in your research"
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
EditResearch.propTypes = {
  getColleges: PropTypes.func.isRequired,
  createResearch: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  research: state.research,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { createResearch, getColleges }
)(withRouter(EditResearch));
