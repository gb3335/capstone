
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";



class UserAction extends Component {


  alerts() {
    alert("Can only edit your own account.")
  }


  render() {


    const { user, auth } = this.props





    let editAction;


    if (auth.isAuthenticated) {

      if (user.email === auth.user.email) {
        editAction = (

          <Link to="/edit-account">
            <label htmlFor="imageUpload" className="btn btn-light">
              <i className="fas fa-pen text-info mr-1" />
              Edit User
           </label>
          </Link>


        );

      }

    }


    return (
      <div className="" role="group">
        {editAction}
        &nbsp;
        <label to="#" htmlFor="imageUpload" className="btn btn-light">
          <i className="fas fa-exchange-alt text-info mr-1" />&nbsp;Change Status
        </label>
        &nbsp;
        <label to="#" htmlFor="imageUpload" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" />
          Change Image
        </label>

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
  {}
)(withRouter(UserAction));
