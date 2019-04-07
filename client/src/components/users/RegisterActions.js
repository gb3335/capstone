import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import SweetAlert from "react-bootstrap-sweetalert";


import {

  createReportForUsers
} from "../../actions/registerActions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "350px",
    height: "410px"
  }
};



class RegisterActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: true,
      userName: true,
      email: true,
      type: true,
      college: true,
      status: true,
      dateCreated: true,
      blockedUsers: true,
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
    if (this.props.users.bin === false) {
      this.props.toggleJournalBin(1);
    } else {
      this.props.toggleJournalBin(0);
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

    if (!this.props.users.users.buttonDisable) {
      if (
        this.state.name === false &&
        this.state.userName === false &&
        this.state.email === false &&
        this.state.type === false &&
        this.state.type === false &&
        this.state.college === false &&
        this.state.status === false &&
        this.state.dateCreated === false &&
        this.state.blockedUsers === false
      ) {
        // show check one alert
        this.setState({ checkOneAlert: true });
      } else {
        const name =
          this.props.auth.user.name.firstName +
          " " +
          this.props.auth.user.name.middleName +
          " " +
          this.props.auth.user.name.lastName;

        const journalReportData = {
          name: this.state.name,
          userName: this.state.userName,
          email: this.state.email,
          type: this.state.type,
          type: this.state.type,
          college: this.state.college,
          status: this.state.status,
          dateCreated: this.state.dateCreated,
          blockedUsers: this.state.blockedUsers,
          users: this.props.users.users,
          typeOfReport: "Users Report",
          printedBy: name
        };

        this.props.createReportForUsers(journalReportData);
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
    const disableFlag = this.props.users.buttonDisable;

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
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
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
                    name="name"
                    id="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    checked={this.state.name}
                  />
                  <label className="form-check-label" htmlFor="name">
                    Name
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="userName"
                    id="userName"
                    value={this.state.userName}
                    onChange={this.onChange}
                    checked={this.state.userName}
                  />
                  <label className="form-check-label" htmlFor="userName">
                    Username
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="email"
                    id="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    checked={this.state.email}
                  />
                  <label className="form-check-label" htmlFor="email">
                    Email
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="type"
                    id="type"
                    value={this.state.type}
                    onChange={this.onChange}
                    checked={this.state.type}
                  />
                  <label className="form-check-label" htmlFor="type">
                    Type
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
                    name="dateCreated"
                    id="dateCreated"
                    value={this.state.dateCreated}
                    onChange={this.onChange}
                    checked={this.state.dateCreated}
                  />
                  <label className="form-check-label" htmlFor="dateCreated">
                    Date Created
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="blockedUsers"
                    id="blockedUsers"
                    value={this.state.blockedUsers}
                    onChange={this.onChange}
                    checked={this.state.blockedUsers}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="blockedUsers"
                  >
                    Include Blocked Users
                  </label>
                </div>
                <br />
                <input
                  type="button"
                  value="Cancel"
                  onClick={this.closeModal}
                  className="btn btn-danger"
                />{" "}
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
        <Link to="/register" className="btn btn-light">
          <i className="fas fa-user-plus text-info mr-1" /> Add Account
      </Link>
        <Link to="#" onClick={this.openModal} className="btn btn-light">
          <i className="fas fa-poll-h text-info mr-1" /> Create Report
        </Link>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users,
  blocked: state.users.blocked,
  auth: state.auth

});

export default connect(
  mapStateToProps,
  { createReportForUsers }
)(RegisterActions);





