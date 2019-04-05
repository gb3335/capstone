import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageFieldGroup from "../common/ImageFieldGroup";
import { changeStatus, changeAvatar } from "../../actions/registerActions";

import SweetAlert from "react-bootstrap-sweetalert";
class MyAccountAction extends Component {
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
        const replaceString = require("replace-string");
        let strstart = 0;
        let a = window.location.href;
        let oldpath;
        let oldid;

        let mylink;

        let b = replaceString(a, "http://localhost:3000/", "");
        if (b.includes("/")) {
          strstart = b.indexOf("/");
          oldpath = b.substring(0, strstart);
          oldid = b.substring(strstart + 1, b.length);
          mylink =
            "/myaccount/" +
            this.props.auth.user.id +
            "/" +
            oldpath +
            "/" +
            oldid;
        } else {
          if (b === "") {
            mylink =
              "/myaccount/" +
              this.props.auth.user.id +
              "/" +
              "undefined" +
              "/" +
              oldid;
          } else {
            mylink =
              "/myaccount/" + this.props.auth.user.id + "/" + b + "/" + oldid;
          }
        }
        if (
          "/myaccount/" +
            this.props.auth.user.id +
            "/myaccount/" +
            this.props.auth.user.id ===
          mylink.substring(
            0,
            (
              "/myaccount/" +
              this.props.auth.user.id +
              "/myaccount/" +
              this.props.auth.user.id
            ).length
          )
        ) {
          mylink = mylink.substring(
            ("/myaccount/" + this.props.auth.user.id).length,
            mylink.length
          );
        }

        let oldlink = mylink;
        mylink = "";

        const data = {
          images: upImages,
          id: this.props.users.user._id,
          oldlink
        };

        this.props.changeAvatar(data, this.props.history);
        this.setState({
          image: "",
          images: []
        });
      }
    };
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
      if (user.email === auth.user.email) {
        editAction = (
          <Link to="/edit-account" className="btn btn-light">
            {" "}
            <i className="fas fa-pen text-info mr-1" />
            Edit User
          </Link>
        );
        imageAction = (
          <label to="#" htmlFor="imageUpload" className="btn btn-light">
            <i className="fas fa-circle-notch text-info mr-1" />
            Change avatar
          </label>
        );
      }
      if (auth.user.userType == "ADMINISTRATOR") {
        blockAction = (
          <Link
            to="#"
            htmlFor="imageUpload"
            className="btn btn-light"
            onClick={this.onDeleteAlert}
          >
            <i className="fas fa-exchange-alt text-info mr-1" />
            &nbsp;Change Status
          </Link>
        );
      }
    }
    return (
      <div>
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
        <div className="btn-group mb-3 btn-group-sm">{editAction}</div>
        <div className="btn-group mb-3 btn-group-sm">{blockAction}</div>
        <div className="btn-group mb-2 btn-group-sm" role="group">
          {imageAction}
          <ImageFieldGroup
            placeholder="* Images"
            name="image"
            value={this.state.image}
            onChange={this.onFileSelected}
            id="imageUpload"
          />
        </div>
      </div>
    );
  }
}

MyAccountAction.propTypes = {
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  changeAvatar: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { changeStatus, changeAvatar }
)(withRouter(MyAccountAction));
