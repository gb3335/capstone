import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";

import { createReportForCollege } from "../../actions/collegeActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Basic info
      researchTotal: true,
      journalTotal: true,
      courseTotal: true,
      lastUpdate: true,
      status: true,

      // courses
      courses: true,
      courseStatus: true,
      courseResearch: true,
      courseJournal: true,
      deletedCourses: false,

      // researches
      listOfResearches: true,
      researchStatus: true,
      researchResId: true,
      researchCollege: true,
      researchCourse: true,
      researchType: true,
      researchPages: true,
      researchAcademicYear: true,
      researchLastUpdate: true,
      deletedResearches: false,

      // for alerts
      checkOneAlert: false,
      generateAlert: false
    };
  }

  onChange = e => {
    let bool;
    if (e.target.value === "false") {
      bool = true;
    } else {
      bool = false;
    }
    this.setState({ [e.target.name]: bool });
  };

  onGenerateReport = e => {
    if (!this.props.college.buttonDisable) {
      if (
        // Basic info
        this.state.researchTotal === false &&
        this.state.journalTotal === false &&
        this.state.courseTotal === false &&
        this.state.status === false &&
        this.state.lastUpdate === false &&
        // Courses
        this.state.courses === false &&
        this.state.courseStatus === false &&
        this.state.courseResearch === false &&
        this.state.courseJournal === false &&
        this.state.deletedCourses === false &&
        // researches
        this.state.listOfResearches === false &&
        this.state.researchStatus === false &&
        this.state.researchResId === false &&
        this.state.researchCollege === false &&
        this.state.researchCourse === false &&
        this.state.researchType === false &&
        this.state.researchPages === false &&
        this.state.researchAcademicYear === false &&
        this.state.researchLastUpdate === false &&
        this.state.deletedResearches === false
      ) {
        // show check one alert
        this.setState({ checkOneAlert: true });
      } else {
        // let researchOfCol = [];
        // this.props.research.researches.map(research => {
        //   if (research.college === this.props.college.college.name.fullName) {
        //     researchOfCol.push(research);
        //   }
        // });

        const name =
          this.props.auth.user.name.firstName +
          " " +
          this.props.auth.user.name.middleName +
          " " +
          this.props.auth.user.name.lastName;
        const reportData = {
          // basic info
          researchTotal: this.state.researchTotal,
          journalTotal: this.state.journalTotal,
          courseTotal: this.state.courseTotal,
          status: this.state.status,
          lastUpdate: this.state.lastUpdate,

          // courses
          courses: this.state.courses,
          courseStatus: this.state.courseStatus,
          courseResearch: this.state.courseResearch,
          courseJournal: this.state.courseJournal,
          deletedCourses: this.state.deletedCourses,

          // researches
          listOfResearches: this.state.listOfResearches,
          researchStatus: this.state.researchStatus,
          researchResId: this.state.researchResId,
          researchCollege: this.state.researchCollege,
          researchCourse: this.state.researchCourse,
          researchType: this.state.researchType,
          researchPages: this.state.researchPages,
          researchAcademicYear: this.state.researchAcademicYear,
          researchLastUpdate: this.state.researchLastUpdate,
          deletedResearches: this.state.deletedResearches,

          // other
          college: this.props.college.college,
          researches: this.props.research.researches,
          typeOfReport: "College Report",
          printedBy: name
        };

        this.props.createReportForCollege(reportData);
        // show generate alert
        this.setState({ generateAlert: true });
      }
    }
  };

  // alert confirms
  onCheckOneAlert = () => {
    this.setState({ checkOneAlert: false });
  };

  onGenerateAlert = () => {
    this.setState({ generateAlert: false });
  };

  render() {
    return (
      <div>
        {/* ALERTS */}
        {/* PLEASE CHECK ONE ALERT */}
        <SweetAlert
          show={this.state.checkOneAlert}
          warning
          title="Oops!"
          onConfirm={this.onCheckOneAlert}
        >
          Please check at least one
        </SweetAlert>
        {/* ------------------------ */}
        {/* PLEASE CHECK ONE ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>

        <h3>Create Report</h3>
        <p className="lead"> Filter</p>
        <div className="row">
          {/* COLLEGE BASIC INFO */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header text-white bg-info">
                <i className="fas fa-info mr-2" />
                Basic Information
              </div>
              <div className="card-body">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="status"
                    id="status"
                    value={this.state.status}
                    checked={this.state.status}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="status">
                    College Status
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchTotal"
                    id="researchTotal"
                    value={this.state.researchTotal}
                    checked={this.state.researchTotal}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchTotal">
                    Total Number of Research
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="journalTotal"
                    id="journalTotal"
                    value={this.state.journalTotal}
                    checked={this.state.journalTotal}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="journalTotal">
                    Total Number of Journal
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="courseTotal"
                    id="courseTotal"
                    value={this.state.courseTotal}
                    checked={this.state.courseTotal}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="courseTotal">
                    Total Number of Course
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="lastUpdate"
                    id="lastUpdate"
                    value={this.state.lastUpdate}
                    checked={this.state.lastUpdate}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="lastUpdate">
                    Last Update
                  </label>
                </div>
              </div>
            </div>
            <br />
          </div>
          {/* COLLEGE COURSES */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header text-white bg-info">
                <i className="fas fa-graduation-cap mr-2" />
                Courses
              </div>
              <div className="card-body">
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="courses"
                    id="courses"
                    value={this.state.courses}
                    checked={this.state.courses}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="courses">
                    College Courses
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="courseStatus"
                    id="courseStatus"
                    value={this.state.courseStatus}
                    checked={this.state.courseStatus}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="courseStatus">
                    Course Status
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="courseResearch"
                    id="courseResearch"
                    value={this.state.courseResearch}
                    checked={this.state.courseResearch}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="courseResearch">
                    Course Researches
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="courseJournal"
                    id="courseJournal"
                    value={this.state.courseJournal}
                    checked={this.state.courseJournal}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="courseJournal">
                    Course Journals
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="deletedCourses"
                    id="deletedCourses"
                    value={this.state.deletedCourses}
                    checked={this.state.deletedCourses}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="deletedCourses">
                    Include Deleted Courses
                  </label>
                </div>
              </div>
            </div>
            <br />
          </div>
          {/* COLLEGE RESEARCHES */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header text-white bg-info">
                <i className="fas fa-book mr-2" />
                Researches
              </div>
              <div className="card-body">
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="listOfResearches"
                    id="listOfResearches"
                    value={this.state.listOfResearches}
                    checked={this.state.listOfResearches}
                    onChange={this.onChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="listOfResearches"
                  >
                    College Researches
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchStatus"
                    id="researchStatus"
                    value={this.state.researchStatus}
                    checked={this.state.researchStatus}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchStatus">
                    Status
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchResId"
                    id="researchResId"
                    value={this.state.researchResId}
                    checked={this.state.researchResId}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchResId">
                    Research ID
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchCollege"
                    id="researchCollege"
                    value={this.state.researchCollege}
                    checked={this.state.researchCollege}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchCollege">
                    College
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchCourse"
                    id="researchCourse"
                    value={this.state.researchCourse}
                    checked={this.state.researchCourse}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchCourse">
                    Course
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchType"
                    id="researchType"
                    value={this.state.researchType}
                    checked={this.state.researchType}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchType">
                    Type
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchPages"
                    id="researchPages"
                    value={this.state.researchPages}
                    checked={this.state.researchPages}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchPages">
                    Pages
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchAcademicYear"
                    id="researchAcademicYear"
                    value={this.state.researchAcademicYear}
                    checked={this.state.researchAcademicYear}
                    onChange={this.onChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="researchAcademicYear"
                  >
                    Academic Year
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchLastUpdate"
                    id="researchLastUpdate"
                    value={this.state.researchLastUpdate}
                    checked={this.state.researchLastUpdate}
                    onChange={this.onChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="researchLastUpdate"
                  >
                    Last Update
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="deletedResearches"
                    id="deletedResearches"
                    value={this.state.deletedResearches}
                    checked={this.state.deletedResearches}
                    onChange={this.onChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="deletedResearches"
                  >
                    Include Deleted College Researches
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
        {this.props.college.buttonDisable ? (
          <button
            type="button"
            onClick={this.onGenerateReport}
            className="btn btn-info disabled"
          >
            <i className="fas fa-print mr-1" />
            Generate Report
          </button>
        ) : (
          <button
            type="button"
            onClick={this.onGenerateReport}
            className="btn btn-info"
          >
            <i className="fas fa-print mr-1" />
            Generate Report
          </button>
        )}
      </div>
    );
  }
}

Report.propTypes = {
  createReportForCollege: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createReportForCollege }
)(Report);
