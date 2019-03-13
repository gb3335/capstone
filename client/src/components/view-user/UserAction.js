
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { changeStatus } from '../../actions/registerActions';

class UserAction extends Component {



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

  render() {


    const { user, auth } = this.props





    let editAction;


    if (auth.isAuthenticated) {

      if (user.email === auth.user.email) {
        editAction = (

          <Link to="/edit-account" className="btn btn-light"> <i className="fas fa-pen text-info mr-1" />Edit User</Link>




        );

      }

    }


    return (
      <div className="btn-group mb-3 btn-group-sm" >
        {editAction}
        <Link to="#" htmlFor="imageUpload" className="btn btn-light" onClick={() => this.changeClick()}>
          <i className="fas fa-exchange-alt text-info mr-1" />&nbsp;Change Status
          </Link>
        <Link to="#" htmlFor="imageUpload" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1 " />
          Change Image
          </Link>

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
