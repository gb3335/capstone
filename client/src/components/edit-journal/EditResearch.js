import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Tesseract } from "tesseract.ts";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

import { createResearch } from "../../actions/journalActions";
import { getColleges } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

class EditResearch extends Component {
  constructor(props) {
    super(props);

    const journal = this.props.journal.journal;

    this.state = {
      title: journal.title,
      oldTitle: journal.title,
      college: journal.college,
      course: journal.course,
      volume: journal.volume,
      publisher: journal.publisher,
      abstract: journal.abstract,
      issn: journal.issn,
      volume: journal.volume,
      publisher: journal.publisher,
      pages: journal.pages,
      schoolYear: journal.schoolYear,
      authorOne: "",
      courseOptions: [{ label: "* Select Course", value: "" }],
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getColleges();

    this.state.courseOptions.length = 0;
    this.state.courseOptions.push({
      label: "* Select Course",
      value: ""
    });

    this.props.college.colleges.map(college =>
      college.name.fullName === this.props.journal.journal.college
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

    let ao = "";

    this.props.journal.journal.author.map(au => {
      if (au.role === "Author One") {
        ao = au.name;
      }
    });

    this.setState({ authorOne: ao });
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
      oldTitle: this.state.oldTitle,
      college: this.state.college,
      course: this.state.course,
      abstract: this.state.abstract,
      pages: this.state.pages,
      issn: this.state.issn,
      volume: this.state.volume,
      publisher: this.state.publisher,
      schoolYear: this.state.schoolYear,
      authorOne: this.state.authorOne,
      id: this.props.journal.journal._id

      // title: journal.title,
      // oldTitle: journal.title,
      // college: journal.college,
      // course: journal.course,
      // volume:journal.volume,
      // publisher:journal.publisher,
      // abstract: journal.abstract,
      // issn: journal.issn,
      // pages: journal.pages,
      // schoolYear: journal.schoolYear,
      // authorOne: "",
    };

    this.refs.resBtn.setAttribute("disabled", "disabled");
    this.props.createResearch(researchData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute("disabled");
  };

  onChangeSelectCollege = e => {
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
    this.setState({ abstract: value });
  };

  quillChange = () => {
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
          ocrProgress: data.status + " at " + dataProg + "%"
        });
      })
      .then(data => {
        this.setState({ abstract: data.text });
      })
      .catch(console.error);
  };

  render() {
    const { college, errors } = this.props;
    const progress = this.state.ocrProgress;

    const path = "/journals/" + this.props.journal.journal._id;
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
    } catch (error) { }

    return (
      <div className="create-research">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={path} className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Journal
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Edit Journal</h1>
              <p className="lead text-center">
                Let's get some information for your journal
              </p>

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
                      onChange={this.onChangeSelectCollege}
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
                  onKeyPress={this.quillChange}
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
                  placeholder="* Volume"
                  name="volume"
                  value={this.state.volume}
                  onChange={this.onChange}
                  error={errors.volume}
                  info="Volume of the journal"
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
                  placeholder="* Journal ID"
                  name="issn"
                  value={this.state.issn}
                  onChange={this.onChange}
                  error={errors.issn}
                  info="ISSN given by the college library"
                />
                <TextFieldGroup
                  placeholder="* Pages"
                  name="pages"
                  value={this.state.pages}
                  onChange={this.onChange}
                  error={errors.pages}
                  info="Number of pages in your journal"
                />
                <TextFieldGroup
                  placeholder="* School Year"
                  name="schoolYear"
                  value={this.state.schoolYear}
                  onChange={this.onChange}
                  error={errors.schoolYear}
                  info="School Year you've finished the journal"
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
  journal: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  journal: state.journal,
  college: state.college,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { createResearch, getColleges }
)(withRouter(EditResearch));
