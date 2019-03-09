import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createReport } from "../../actions/collegeActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      research: false,
      journal: false,
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
      this.state.research === false &&
      this.state.journal === false &&
      this.state.status === false &&
      this.state.courses === false
    ) {
      alert("Please Check at least one");
    } else {
      let researchOfCol = [];
      this.props.research.researches.map(research => {
        if (research.college === this.props.college.college.name.fullName) {
          researchOfCol.push(research);
        }
      });

      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;
      const reportData = {
        research: this.state.research,
        journal: this.state.journal,
        status: this.state.status,
        courses: this.state.courses,
        college: this.props.college.college,
        researchOfCol: researchOfCol,
        typeOfReport: "College Report",
        printedBy: name
      };

      this.props.createReport(reportData);

      alert("Please wait while your report is being generated");
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
            name="status"
            id="status"
            value={this.state.status}
            onChange={this.onChange}
          />
          <label className="form-check-label" htmlFor="status">
            Status
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="research"
            id="research"
            value={this.state.research}
            onChange={this.onChange}
          />
          <label className="form-check-label" htmlFor="research">
            Research
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="journal"
            id="journal"
            value={this.state.journal}
            onChange={this.onChange}
          />
          <label className="form-check-label" htmlFor="journal">
            Journal
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
  { createReport }
)(Report);
