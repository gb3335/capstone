
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageFieldGroup from "../common/ImageFieldGroup";
import { changeStatus, changeAvatar } from '../../actions/registerActions';



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
          id: this.props.users.user._id,

        };

        this.props.changeAvatar(data, this.props.history);
        this.setState({
          image: "",
          images: []
        })
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
    this.setState({ deleteAlertOkay: false })


  };
  onDeleteResearch = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  render() {


    const { user, auth } = this.props





    let editAction;
    let imageAction;
    let blockAction;

    if (auth.isAuthenticated) {

      if (user.email === auth.user.email) {
        editAction = (

          <Link to="/edit-account" className="btn btn-light"> <i className="fas fa-pen text-info mr-1" />Edit User</Link>




        );
        imageAction = (

          <label to="#" htmlFor="imageUpload" className="btn btn-light">
            <i className="fas fa-circle-notch text-info mr-1" />
            Change avatar
          </label>


        )

      }
      if (auth.user.userType === 'ADMINISTRATOR') {
        blockAction = (<Link to="#" htmlFor="imageUpload" className="btn btn-light" onClick={this.onDeleteAlert}>
          <i className="fas fa-exchange-alt text-info mr-1" />&nbsp;Change Status
        </Link>)
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
        <div className="btn-group mb-3 btn-group-sm" >
          {editAction}
        </div>
        <div className="btn-group mb-3 btn-group-sm" >
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

      </div>
    );
  }
}

UserAction.propTypes = {
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
)(withRouter(UserAction));
