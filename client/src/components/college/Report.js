import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createReport } from "../../actions/collegeActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchTotal: false,
      journalTotal: false,
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
    if (
      this.state.researchTotal === false &&
      this.state.journalTotal === false &&
      this.state.status === false &&
      this.state.courses === false
    ) {
      alert("Please Check at least one");
    } else {
      const reportData = {
        researchTotal: this.state.researchTotal,
        journalTotal: this.state.journalTotal,
        status: this.state.status,
        courses: this.state.courses,
        college: this.props.college.college,
        typeOfReport: "College Report"
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
            name="researchTotal"
            id="researchTotal"
            value={this.state.researchTotal}
            onChange={this.onChange}
          />
          <label className="form-check-label" htmlFor="researchTotal">
            Research Count
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
  createReport: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college
});

export default connect(
  mapStateToProps,
  { createReport }
)(Report);
