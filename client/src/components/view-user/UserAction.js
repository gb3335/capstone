
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { changeStatus } from '../../actions/registerActions';

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
      showAlertOkay: false
    };
  }


  changeClick() {


    const userData = {

      id: this.props.users.user._id,
      isBlock: this.props.users.user.isBlock

    };

    var answer = window.confirm("Change user status?")
    if (answer) {
      this.props.changeStatus(userData, this.props.history);
    }





  }

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
      isBlock: this.props.users.user.isBlock

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
          <Link to="#" htmlFor="imageUpload" className="btn btn-light">
            <i className="fas fa-plus text-info mr-1 " />
            Change Image
        </Link>
        )

      }
      if (user.userType == 'ADMINISTRATOR') {
        blockAction = (<Link to="#" htmlFor="imageUpload" className="btn btn-light" onClick={this.onDeleteAlert}>
          <i className="fas fa-exchange-alt text-info mr-1" />&nbsp;Change Status
        </Link>)
      }

    }
    return (
      <div className="btn-group mb-3 btn-group-sm" >
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
        {editAction}
        {blockAction}
        {imageAction}

      </div>
    );
  }
}

UserAction.propTypes = {
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { changeStatus }
)(withRouter(UserAction));
