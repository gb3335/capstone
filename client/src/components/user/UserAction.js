import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageFieldGroup from "../common/ImageFieldGroup";
import {
  changeStatus,
  changeAvatarBySuper,
  createReportForUser
} from "../../actions/registerActions";

import SweetAlert from "react-bootstrap-sweetalert";
class UserAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Delete Alert
      deleteAlert: false,
      deleteAlertCancel: false,
      deleteAlertOkay: false,
      // Restore Alert
      restoreAlert: false,
      restoreAlertCancel: false,
      restoreAlertOkay: false,
      // Hide Alert
      hideAlert: false,
      hideAlertCancel: false,
      hideAlertOkay: false,
      // Show Alert
      showAlert: false,
      showAlertCancel: false,
      showAlertOkay: false,
      generateAlert: false,
      image: "",
      images: []
    };
  }
  onFileSelected = e => {
    const files = e.target.files;
    const len = files.length;
    let i = 0;
    let ctr = 0;
    let upImages;

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = e => {
      this.setState({
        images: [...this.state.images, e.target.result]
      });
      upImages = this.state.images;
      ctr = 1;

      if (ctr === len) {
        const data = {
          images: upImages,
          id: this.props.users.user._id
        };

        this.props.changeAvatarBySuper(data, this.props.history);
        this.setState({
          image: "",
          images: []
        });
      }
    };
  };
  onGenerateReport = () => {
    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    const usersReport = {
      user: this.props.users.user,
      typeOfReport: "User Report",
      printedBy: name
    };

    this.props.createReportForUser(usersReport);

    // show generate alert
    this.setState({ generateAlert: true });
  };

  onGenerateAlert = () => {
    this.setState({ generateAlert: false });
  };
  onDeleteAlert = () => {
    this.setState({ deleteAlert: true });
  };
  onCancelDelete = () => {
    this.setState({ deleteAlert: false, deleteAlertCancel: true });
  };
  onRemoveDeleteCancel = () => {
    this.setState({ deleteAlertCancel: false });
  };
  onRemoveDeleteOkay = () => {
    const userData = {
      id: this.props.users.user._id,
      isBlock: this.props.users.user.isBlock,
      loginid: this.props.auth.user.id
    };

    this.props.changeStatus(userData, this.props.history);
    this.setState({ deleteAlertOkay: false });
  };
  onDeleteResearch = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  render() {
    const { user, auth } = this.props;

    let editAction;
    let imageAction;
    let blockAction;

    if (auth.isAuthenticated) {
      if (
        user.email === auth.user.email ||
        this.props.auth.user.superAdmin === "true"
      ) {
        editAction = (
          <Link to="/edit-by-super" className="btn btn-light">
            {" "}
            <i className="fas fa-pen text-info mr-1" />
            Edit User
          </Link>
        );
        imageAction = (
          <label to="#" htmlFor="imageUpload" className="btn btn-light mt-2">
            <i className="fas fa-circle-notch text-info mr-1" />
            Change avatar
          </label>
        );
      }
      if (this.props.users.user.userType !== "ADMINISTRATOR") {
        blockAction =
          user.isBlock === 0 ? (
            <Link
              to="#"
              htmlFor="imageUpload"
              className="btn btn-light"
              onClick={this.onDeleteAlert}
            >
              <i className="fas fa-exchange-alt text-danger mr-1" />
              &nbsp;Deactivate
            </Link>
          ) : (
            <Link
              to="#"
              htmlFor="imageUpload"
              className="btn btn-light"
              onClick={this.onDeleteAlert}
            >
              <i className="fas fa-exchange-alt text-success mr-1" />
              &nbsp;Activate
            </Link>
          );
      } else if (this.props.auth.user.superAdmin === "true") {
        blockAction =
          user.isBlock === 0 ? (
            <Link
              to="#"
              htmlFor="imageUpload"
              className="btn btn-light"
              onClick={this.onDeleteAlert}
            >
              <i className="fas fa-exchange-alt text-danger mr-1" />
              &nbsp;Deactivate
            </Link>
          ) : (
            <Link
              to="#"
              htmlFor="imageUpload"
              className="btn btn-light"
              onClick={this.onDeleteAlert}
            >
              <i className="fas fa-exchange-alt text-success mr-1" />
              &nbsp;Activate
            </Link>
          );
      }
    }
    return (
      <div>
        {/* ALERTS */}
        {/* GENERATE REPORT ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>
        <SweetAlert
          show={this.state.deleteAlert}
          warning
          showCancel
          confirmBtnText="Yes, change it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onDeleteResearch}
          onCancel={this.onCancelDelete}
        >
          Change status?
        </SweetAlert>

        {/* CANCEL change */}
        <SweetAlert
          show={this.state.deleteAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveDeleteCancel}
        >
          Account status not changed.
        </SweetAlert>

        {/* Status change */}
        <SweetAlert
          show={this.state.deleteAlertOkay}
          success
          title="Changed"
          onConfirm={this.onRemoveDeleteOkay}
        >
          Status Changed.
        </SweetAlert>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {editAction}
        </div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {blockAction}
        </div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {imageAction}
          <ImageFieldGroup
            placeholder="* Images"
            name="image"
            value={this.state.image}
            onChange={this.onFileSelected}
            id="imageUpload"
          />
        </div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          <Link
            to="#"
            onClick={this.onGenerateReport}
            className="btn btn-light"
          >
            <i className="fas fa-poll-h text-info mr-1" />
            Create Report
          </Link>
        </div>
      </div>
    );
  }
}

UserAction.propTypes = {
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  changeAvatarBySuper: PropTypes.func.isRequired,
  createReportForUser: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { changeStatus, changeAvatarBySuper, createReportForUser }
)(withRouter(UserAction));
