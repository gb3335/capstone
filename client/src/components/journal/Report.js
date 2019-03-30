import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";

import { createReportForJournal } from "../../actions/journalActions";

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Basic info
      college: true,
      course: true,
      issn: true,
      pages: true,
      yearPublished: true,
      lastUpdate: true,
      description: true,
      authors: true,
      volume: true,
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
    if (!this.props.journal.buttonDisable) {
      if (
        // Basic info
        this.state.college === false &&
        this.state.course === false &&
        this.state.issn === false &&
        this.state.pages === false &&
        this.state.yearPublished === false &&
        this.state.lastUpdate === false &&
        this.state.description === false &&
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
          this.props.auth.user.firstName +
          " " +
          this.props.auth.user.middleName +
          " " +
          this.props.auth.user.lastName;
        const reportData = {
          // basic info
          college: this.state.college,
          course: this.state.course,
          issn: this.state.issn,
          pages: this.state.pages,
          yearPublished: this.state.yearPublished,
          lastUpdate: this.state.lastUpdate,
          description: this.state.description,
          authors: this.state.authors,
          volume: this.state.volume,
          journal: this.props.journal.journal,
          typeOfReport: "Journal Report",
          printedBy: name
        };

        this.props.createReportForJournal(reportData);
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
                    name="college"
                    id="college"
                    value={this.state.college}
                    checked={this.state.college}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="college">
                    Journal College
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
                    Journal Course
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="issn"
                    id="issn"
                    value={this.state.issn}
                    checked={this.state.issn}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="issn">
                    ISSN
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="volume"
                    id="volume"
                    value={this.state.volume}
                    checked={this.state.volume}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="volume">
                    Volume
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
                    name="yearPublished"
                    id="yearPublished"
                    value={this.state.yearPublished}
                    checked={this.state.yearPublished}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="yearPublished">
                    Published Year
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
                    name="description"
                    id="description"
                    value={this.state.description}
                    checked={this.state.description}
                    onChange={this.onChange}
                  />
                  <label className="form-check-label" htmlFor="description">
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
        {this.props.journal.buttonDisable ? (
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
  createReportForJournal: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  journal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  journal: state.journal,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createReportForJournal }
)(Report);
