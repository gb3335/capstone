
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

    var answer = window.confirm("Save data?")
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
        <label to="#" htmlFor="imageUpload" className="btn btn-light" onClick={() => this.changeClick()}>
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
  { changeStatus }
)(withRouter(UserAction));
