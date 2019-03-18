import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import SweetAlert from "react-bootstrap-sweetalert";

import {
  toggleCollegeBin,
  toggleCollegeList,
  createReportForColleges
} from "../../actions/collegeActions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "350px",
    height: "380px"
  }
};

Modal.setAppElement("#root");

class CollegesActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      researchTotal: true,
      journalTotal: true,
      coursesTotal: true,
      lastUpdate: true,
      status: true,
      deletedColleges: false,
      bin: false,
      list: false,
      modalIsOpen: false,

      // for alerts
      checkOneAlert: false,
      generateAlert: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
    this.setState({ list: nextProps.list });
  }

  onToggleBin = e => {
    if (this.props.college.bin === false) {
      this.props.toggleCollegeBin(1);
    } else {
      this.props.toggleCollegeBin(0);
    }
  };

  onToggleList = e => {
    if (this.props.college.list === false) {
      this.props.toggleCollegeList(1);
    } else {
      this.props.toggleCollegeList(0);
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
    if (!this.props.college.buttonDisable) {
      if (
        this.state.status === false &&
        this.state.coursesTotal === false &&
        this.state.researchTotal === false &&
        this.state.journalTotal === false &&
        this.state.lastUpdate === false &&
        this.state.deletedColleges === false
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

        const collegesReportData = {
          status: this.state.status,
          coursesTotal: this.state.coursesTotal,
          researchTotal: this.state.researchTotal,
          journalTotal: this.state.journalTotal,
          lastUpdate: this.state.lastUpdate,
          colleges: this.props.college.colleges,
          deletedColleges: this.state.deletedColleges,
          typeOfReport: "Colleges Report",
          printedBy: name
        };

        this.props.createReportForColleges(collegesReportData);
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
    let binActionForAuth;
    let listAction;
    let addAction;
    let reportAction;

    const disableFlag = this.props.college.buttonDisable;

    if (this.state.bin) {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> Colleges
        </Link>
      );
    } else {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </Link>
      );
    }

    if (this.state.list) {
      listAction = (
        <Link to="#" onClick={this.onToggleList} className="btn btn-light">
          <i className="fas fa-list text-info" title="List View" />
        </Link>
      );
    } else {
      listAction = (
        <Link to="#" onClick={this.onToggleList} className="btn btn-light">
          <i className="fas fa-th-large text-info" title="Grid View" />
        </Link>
      );
    }

    if (this.props.auth.isAuthenticated) {
      addAction = (
        <Link to="/add-college" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add College
        </Link>
      );
      reportAction = (
        <Link to="#" onClick={this.openModal} className="btn btn-light">
          <i className="fas fa-poll-h text-info mr-1" /> Create Report
        </Link>
      );
      binActionForAuth = binAction;
    }

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

        {/* PLEASE CHECK ONE ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>

        <div className="btn-group mb-3 btn-group-sm" role="group">
          {addAction}
          {reportAction}
          {binActionForAuth}
        </div>
        <div
          className="btn-group mb-3 btn-group-sm"
          role="group"
          style={{ float: "right" }}
        >
          {listAction}
        </div>
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
                    name="coursesTotal"
                    id="coursesTotal"
                    value={this.state.coursesTotal}
                    onChange={this.onChange}
                    checked={this.state.coursesTotal}
                  />
                  <label className="form-check-label" htmlFor="coursesTotal">
                    Number of Course
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="researchTotal"
                    id="researchTotal"
                    value={this.state.researchTotal}
                    onChange={this.onChange}
                    checked={this.state.researchTotal}
                  />
                  <label className="form-check-label" htmlFor="researchTotal">
                    Number of Researches
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="journalTotal"
                    id="journalTotal"
                    value={this.state.journalTotal}
                    onChange={this.onChange}
                    checked={this.state.journalTotal}
                  />
                  <label className="form-check-label" htmlFor="journalTotal">
                    Number of Journals
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
                    name="deletedColleges"
                    id="deletedColleges"
                    value={this.state.deletedColleges}
                    onChange={this.onChange}
                    checked={this.state.deletedColleges}
                  />
                  <label className="form-check-label" htmlFor="deletedColleges">
                    Include Deleted Colleges
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
CollegesActions.propTypes = {
  toggleCollegeBin: PropTypes.func.isRequired,
  toggleCollegeList: PropTypes.func.isRequired,
  createReportForColleges: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  bin: state.college.bin,
  list: state.college.list,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { toggleCollegeBin, toggleCollegeList, createReportForColleges }
)(CollegesActions);
