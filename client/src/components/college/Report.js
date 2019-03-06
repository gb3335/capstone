import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createReport } from "../../actions/collegeActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchCount: false,
      journalCount: false,
      status: false,
      courses: false
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
    // console.log(
    //   "course: ",
    //   this.state.courses,
    //   "jc: ",
    //   this.state.journalCount,
    //   "rc: ",
    //   this.state.researchCount,
    //   "stat: ",
    //   this.state.status
    // );

    if (
      this.state.researchCount === false &&
      this.state.journalCount === false &&
      this.state.status === false &&
      this.state.courses === false
    ) {
      alert("Please Check at least one");
    } else {
      const reportData = {
        researchCount: this.state.researchCount,
        journalCount: this.state.journalCount,
        status: this.state.status,
        courses: this.state.courses
      };

      this.props.createReport(reportData);
    }
  };

  render() {
    return (
      <div>
        <h3>Create Report</h3>
        <p className="lead">Filter</p>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="researchCount"
            id="researchCount"
            value={this.state.researchCount}
            onChange={this.onChange}
          />
          <label className="form-check-label" htmlFor="researchCount">
            Research Count
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="journalCount"
            id="journalCount"
            value={this.state.journalCount}
            onChange={this.onChange}
          />
          <label className="form-check-label" htmlFor="journalCount">
            Journal Count
          </label>
        </div>
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
            Status
          </label>
        </div>
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
            Courses
          </label>
        </div>
        <br />
        <input
          type="button"
          value="Generate Report"
          onClick={this.onGenerateReport}
          className="btn btn-info"
        />
      </div>
    );
  }
}

Report.propTypes = {
  createReport: PropTypes.func.isRequired
};

export default connect(
  null,
  { createReport }
)(Report);
