import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createReportForCollege } from "../../actions/collegeActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchTotal: false,
      journalTotal: false,
      lastUpdate: false,
      status: false,
      courses: false,
      deletedCourses: false,
      listOfResearches: false,
      deletedResearches: false
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
        this.state.researchTotal === false &&
        this.state.journalTotal === false &&
        this.state.status === false &&
        this.state.lastUpdate === false &&
        this.state.courses === false &&
        this.state.deletedCourses === false &&
        this.state.listOfResearches === false &&
        this.state.deletedResearches === false
      ) {
        alert("Please Check at least one");
      } else {
        // let researchOfCol = [];
        // this.props.research.researches.map(research => {
        //   if (research.college === this.props.college.college.name.fullName) {
        //     researchOfCol.push(research);
        //   }
        // });

        const name =
          this.props.auth.user.firstName +
          " " +
          this.props.auth.user.middleName +
          " " +
          this.props.auth.user.lastName;
        const reportData = {
          researchTotal: this.state.researchTotal,
          journalTotal: this.state.journalTotal,
          status: this.state.status,
          lastUpdate: this.state.lastUpdate,
          courses: this.state.courses,
          deletedCourses: this.state.deletedCourses,
          college: this.props.college.college,
          listOfResearches: this.state.listOfResearches,
          deletedResearches: this.state.deletedResearches,
          researches: this.props.research.researches,
          typeOfReport: "College Report",
          printedBy: name
        };

        this.props.createReportForCollege(reportData);
        alert("Please wait while your report is being generated");
      }
    }
  };

  render() {
    return (
      <div>
        <h3>Create Report</h3>
        <p className="lead"> Filter</p>
        <div className="row">
          {/* COLLEGE BASIC INFO */}
          <div className="col-4">
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
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="journalTotal">
                    Total Number of Journal
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="lastUpdate"
                    id="lastUpdate"
                    value={this.state.lastUpdate}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="lastUpdate">
                    Last Update
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* COLLEGE COURSES */}
          <div className="col-4">
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
                    name="deletedCourses"
                    id="deletedCourses"
                    value={this.state.deletedCourses}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="deletedCourses">
                    Include Deleted Courses
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* COLLEGE RESEARCHES */}
          <div className="col-4">
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
                    name="deletedResearches"
                    id="deletedResearches"
                    value={this.state.deletedResearches}
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
