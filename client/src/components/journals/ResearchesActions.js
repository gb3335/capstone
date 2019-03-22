import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import SweetAlert from "react-bootstrap-sweetalert";

import {
  toggleResearchBin,
  createReportForResearches
} from "../../actions/journalActions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "390px",
    height: "460px"
  }
};

class ResearchesAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      issn: true,
      college: true,
      course: true,
      pages: true,
      academicYear: true,
      lastUpdate: true,
      deletedJournals: false,
      bin: false,
      modalIsOpen: false,
      // for alerts
      checkOneAlert: false,
      generateAlert: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  onToggleBin = e => {
    if (this.props.journal.bin === false) {
      this.props.toggleResearchBin(1);
    } else {
      this.props.toggleResearchBin(0);
    }
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#2874A6";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  onChange = e => {
    let bool;
    if (e.target.value === "false") {
      bool = true;
    } else {
      bool = false;
    }
    this.setState({ [e.target.name]: bool });
  };

  onGenerateReport = () => {
    if (!this.props.journal.buttonDisable) {
      if (
        this.state.status === false &&
        this.state.issn === false &&
        this.state.college === false &&
        this.state.course === false &&
        this.state.type === false &&
        this.state.pages === false &&
        this.state.academicYear === false &&
        this.state.lastUpdate === false &&
        this.state.deletedJournals === false
      ) {
        // show check one alert
        this.setState({ checkOneAlert: true });
      } else {
        const name =
          this.props.auth.user.firstName +
          " " +
          this.props.auth.user.middleName +
          " " +
          this.props.auth.user.lastName;

        const researchesReportData = {
          status: this.state.status,
          issn: this.state.issn,
          college: this.state.college,
          course: this.state.course,
          type: this.state.type,
          pages: this.state.pages,
          academicYear: this.state.academicYear,
          lastUpdate: this.state.lastUpdate,
          deletedJournals: this.state.deletedJournals,
          researches: this.props.journal.journals,
          typeOfReport: "Journals Report",
          printedBy: name
        };

        this.props.createReportForResearches(researchesReportData);
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
    let binAction;
    const disableFlag = this.props.journal.buttonDisable;

    if (this.state.bin) {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> Journals
        </Link>
      );
    } else {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </Link>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
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
        <Link to="/add-journal" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add Journal
        </Link>
        <Link to="#" onClick={this.openModal} className="btn btn-light">
          <i className="fas fa-poll-h text-info mr-1" /> Create Report
        </Link>
        {binAction}

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button
            className="btn btn-danger"
            style={{ float: "right", fontSize: "15px" }}
            onClick={this.closeModal}
          >
            <i className="fas fa-times" />
          </button>
          <br />
          <br />
          <div className="row">
            <div className="col-12">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Create Report
              </h2>
              <div>
                <h4>Filter</h4>
              </div>
              <form>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="status"
                    id="status"
                    value={this.state.status}
                    onChange={this.onChange}
                    checked={this.state.status}
                  />
                  <label className="form-check-label" htmlFor="status">
                    Status
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="issn"
                    id="issn"
                    value={this.state.issn}
                    onChange={this.onChange}
                    checked={this.state.issn}
                  />
                  <label className="form-check-label" htmlFor="issn">
                    ISSN
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="college"
                    id="college"
                    value={this.state.college}
                    onChange={this.onChange}
                    checked={this.state.college}
                  />
                  <label className="form-check-label" htmlFor="college">
                    College
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="course"
                    id="course"
                    value={this.state.course}
                    onChange={this.onChange}
                    checked={this.state.course}
                  />
                  <label className="form-check-label" htmlFor="course">
                    Course
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="pages"
                    id="pages"
                    value={this.state.pages}
                    onChange={this.onChange}
                    checked={this.state.pages}
                  />
                  <label className="form-check-label" htmlFor="pages">
                    Pages
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="academicYear"
                    id="academicYear"
                    value={this.state.academicYear}
                    onChange={this.onChange}
                    checked={this.state.academicYear}
                  />
                  <label className="form-check-label" htmlFor="academicYear">
                    Published Year
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="lastUpdate"
                    id="lastUpdate"
                    value={this.state.lastUpdate}
                    onChange={this.onChange}
                    checked={this.state.lastUpdate}
                  />
                  <label className="form-check-label" htmlFor="lastUpdate">
                    Last Update
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="deletedJournals"
                    id="deletedJournals"
                    value={this.state.deletedJournals}
                    onChange={this.onChange}
                    checked={this.state.deletedJournals}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="deletedJournals"
                  >
                    Include Deleted Journals
                  </label>
                </div>
                <br />
                {disableFlag ? (
                  <input
                    type="button"
                    value="Generate Report"
                    onClick={this.onGenerateReport}
                    className="btn btn-info disabled"
                  />
                ) : (
                    <input
                      type="button"
                      value="Generate Report"
                      onClick={this.onGenerateReport}
                      className="btn btn-info"
                    />
                  )}
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ResearchesAction.propTypes = {
  toggleResearchBin: PropTypes.func.isRequired,
  createReportForResearches: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  journal: state.journal,
  bin: state.journal.bin,
  auth: state.auth

});

export default connect(
  mapStateToProps,
  { toggleResearchBin, createReportForResearches }
)(ResearchesAction);
