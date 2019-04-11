import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageFieldGroup from "../common/ImageFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import {
  changeStatus,
  changeAvatar,
  createReportForUser,
  createBackup
} from "../../actions/registerActions";
import SweetAlert from "react-bootstrap-sweetalert";
import Modal from "react-modal";
import ReCAPTCHA from "react-google-recaptcha";

const customStylesFilter = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "350px",
    height: "330px"
  }
};

Modal.setAppElement("#root");

class MyAccountAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Delete Alert
      generateAlert: false,
      image: "",
      images: [],
      modalIsOpen: false,
      title: "",
      disabledBackupBtn: true,
      backupAlert: false,
      titleError: ""
    };
  }
  onFileSelected = e => {
    const files = e.target.files;
    const len = files.length;
    let i = 0;
    let ctr = 0;
    let upImages;

    let currentLink = window.location.href;
    let firstOccurencePath;
    let firstOccurence = currentLink.indexOf("/");
    firstOccurencePath = currentLink.substring(
      firstOccurence + 1,
      currentLink.length
    );
    let secondOccurencePath;
    let secondOccurence = firstOccurencePath.indexOf("/");
    secondOccurencePath = firstOccurencePath.substring(
      secondOccurence + 1,
      firstOccurencePath.length
    );
    let thirdOccurencePath;
    let thirdOccurence = secondOccurencePath.indexOf("/");
    thirdOccurencePath = secondOccurencePath.substring(
      thirdOccurence + 1,
      secondOccurencePath.length
    );

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
          id: this.props.users.user._id,
          createdBy: this.props.auth.id,
          username: this.props.users.user.userName
            ? this.props.users.user.userName
            : this.props.users.user.email,
          oldlink: thirdOccurencePath
        };

        this.props.changeAvatar(data, this.props.history);
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

  // Modal
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#2874A6";
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      disabledBackupBtn: true,
      titleError: ""
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // create Backup
  onCreateBackup = () => {
    if (this.state.title.length !== 0) {
      const newBackup = {
        title: this.state.title,
        userId: this.props.auth.user.id
      };

      this.props.createBackup(newBackup);
      this.setState({
        backupAlert: true,
        modalIsOpen: false,
        disabledBackupBtn: true,
        title: "",
        titleError: ""
      });
    } else {
      this.setState({ titleError: "Backup Name is Required" });
    }
  };

  render() {
    const { user, auth } = this.props;
    const { errors } = this.props;

    let oldlink;
    let oldid;
    let currentLink = window.location.href;
    let firstOccurencePath;
    let firstOccurence = currentLink.indexOf("/");
    firstOccurencePath = currentLink.substring(
      firstOccurence + 1,
      currentLink.length
    );
    let secondOccurencePath;
    let secondOccurence = firstOccurencePath.indexOf("/");
    secondOccurencePath = firstOccurencePath.substring(
      secondOccurence + 1,
      firstOccurencePath.length
    );
    let thirdOccurencePath;
    let thirdOccurence = secondOccurencePath.indexOf("/");
    thirdOccurencePath = secondOccurencePath.substring(
      thirdOccurence + 1,
      secondOccurencePath.length
    );
    let fouthOccurencePath;
    let fourthOccurence = thirdOccurencePath.indexOf("/");
    fouthOccurencePath = thirdOccurencePath.substring(
      fourthOccurence + 1,
      thirdOccurencePath.length
    );
    // OLDLINK
    let fifthOccurencePath;
    let fifthOccurence = fouthOccurencePath.indexOf("/");
    fifthOccurencePath = fouthOccurencePath.substring(
      fifthOccurence + 1,
      fouthOccurencePath.length
    );
    //Continuation
    let sixthOccurencePath;
    let sixthOccurence = fifthOccurencePath.indexOf("/");
    sixthOccurencePath = fifthOccurencePath.substring(
      sixthOccurence + 1,
      fifthOccurencePath.length
    );

    let getlink;
    let getoldlinkOccurence = fifthOccurencePath.indexOf("/");
    getlink = fifthOccurencePath.substring(0, getoldlinkOccurence);

    if (sixthOccurencePath.includes("/")) {
      oldlink = `/${fifthOccurencePath}`;
    } else {
      if (getlink === sixthOccurencePath) {
        oldlink = `/${getlink}`;
      } else {
        oldlink = `/${getlink}/${sixthOccurencePath}`;
      }
    }

    let editAction;
    let imageAction;
    let blockAction;
    let createBU;
    let listBU;

    if (auth.isAuthenticated) {
      if (user.email === auth.user.email) {
        editAction = (
          <Link
            to={`/edit-account/${getlink}/${sixthOccurencePath}`}
            className="btn btn-light"
          >
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
      if (user.userType === "ADMINISTRATOR") {
        createBU = (
          <Link
            to="#"
            onClick={() => this.setState({ modalIsOpen: true })}
            className="btn btn-light"
          >
            <i className="fas fa-folder-plus text-info mr-1" />
            Create Backup
          </Link>
        );

        listBU = (
          <Link to="/backup-list" className="btn btn-light">
            <i className="fas fa-list-alt text-info mr-1" />
            List of Backups
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

        {/* BACKUP CREATED */}
        <SweetAlert
          show={this.state.backupAlert}
          success
          title="Great!"
          onConfirm={() => this.setState({ backupAlert: false })}
        >
          Successfully created a database backup
        </SweetAlert>

        {/* Backup Modal */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStylesFilter}
          contentLabel="Example Modal"
        >
          <div className="row">
            <div className="col-12">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Create Backup
              </h2>

              <form>
                <br />
                <TextFieldGroup
                  placeholder="Backup Name"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={(errors.title, this.state.titleError)}
                />
                <ReCAPTCHA
                  sitekey="6Le7RJ0UAAAAAN8KGM_-BAUk226wx-JT8rrfa3JM"
                  onChange={() => this.setState({ disabledBackupBtn: false })}
                />
                <input
                  ref="backupBtn"
                  type="button"
                  value="Cancel"
                  onClick={() =>
                    this.setState({
                      modalIsOpen: false,
                      disabledBackupBtn: true,
                      titleError: ""
                    })
                  }
                  className="btn btn-danger mt-3"
                />{" "}
                {this.state.disabledBackupBtn ? (
                  <input
                    ref="backupBtn"
                    type="button"
                    value="Submit"
                    className="btn btn-info mt-3"
                    disabled
                  />
                ) : (
                  <input
                    ref="backupBtn"
                    type="button"
                    value="Submit"
                    onClick={this.onCreateBackup}
                    className="btn btn-info mt-3"
                  />
                )}
              </form>
            </div>
          </div>
        </Modal>

        <div className="btn-group mb-3 btn-group-sm" role="group">
          {editAction}
        </div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {blockAction}
        </div>
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
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {createBU}
          {listBU}
        </div>
      </div>
    );
  }
}

MyAccountAction.propTypes = {
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  changeAvatar: PropTypes.func.isRequired,
  createReportForUser: PropTypes.func.isRequired,
  createBackup: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { changeStatus, changeAvatar, createReportForUser, createBackup }
)(withRouter(MyAccountAction));
