import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";

import { createReportForResearch } from "../../actions/researchActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Basic info
      college: true,
      course: true,
      researchId: true,
      pages: true,
      academicYear: true,
      lastUpdate: true,
      type: true,
      abstract: true,
      authors: true,
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
    if (!this.props.research.buttonDisable) {
      if (
        // Basic info
        this.state.college === false &&
        this.state.course === false &&
        this.state.researchId === false &&
        this.state.pages === false &&
        this.state.academicYear === false &&
        this.state.lastUpdate === false &&
        this.state.type === false &&
        this.state.abstract === false &&
        this.state.authors === false
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
          college: this.state.college,
          course: this.state.course,
          researchId: this.state.researchId,
          pages: this.state.pages,
          academicYear: this.state.academicYear,
          lastUpdate: this.state.lastUpdate,
          type: this.state.type,
          abstract: this.state.abstract,
          authors: this.state.authors,
          research: this.props.research.research,
          typeOfReport: "Research Report",
          printedBy: name
        };

        this.props.createReportForResearch(reportData);
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
            <div className="card shadow">
              <div className="card-header text-white bg-info">
                <i className="fas fa-info mr-2" />
                Basic Information
              </div>
              <div className="card-body">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="college"
                    id="college"
                    value={this.state.college}
                    checked={this.state.college}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="college">
                    Research College
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="course"
                    id="course"
                    value={this.state.course}
                    checked={this.state.course}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="course">
                    Research Course
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="researchId"
                    id="researchId"
                    value={this.state.researchId}
                    checked={this.state.researchId}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="researchId">
                    Research ID
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="pages"
                    id="pages"
                    value={this.state.pages}
                    checked={this.state.pages}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="pages">
                    Pages
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="academicYear"
                    id="academicYear"
                    value={this.state.academicYear}
                    checked={this.state.academicYear}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="academicYear">
                    Academic Year
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
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="type"
                    id="type"
                    value={this.state.type}
                    checked={this.state.type}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="type">
                    Research Type
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="abstract"
                    id="abstract"
                    value={this.state.abstract}
                    checked={this.state.abstract}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="abstract">
                    Abstract
                  </label>
                </div>
                <div className="form-check disabled">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="authors"
                    id="authors"
                    value={this.state.authors}
                    checked={this.state.authors}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="authors">
                    Authors
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
        {this.props.research.buttonDisable ? (
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
  createReportForResearch: PropTypes.func.isRequired,
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
  { createReportForResearch }
)(Report);
