import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";

import { getUserById } from "../../actions/userActions";
import ViewUserHeader from "./ViewUserHeader";
import ViewUserDetails from "./ViewUserDetails";
import UserAction from './UserAction'
// import CollegeHeader from "./CollegeHeader";
// import CollegeDetails from "./CollegeDetails";
// import CollegeCourses from "./CollegeCourses";
// import CollegeActions from "./CollegeActions";
// import CollegeCourseActions from "./CollegeCourseActions";

class ViewUser extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getUserById(this.props.match.params.id);
    }
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.getUserById(this.props.match.params.id);
    }
  }





  render() {



    const { loading } = this.props.users;
    const {user} = this.props.auth;
    const auth = this.props.auth;
    const isAuthenticated = this.props.auth.isAuthenticated;

    let userContent;
    let useraction;
    let userstatus;

    if (isAuthenticated) {
      useraction = <UserAction user={user} auth={auth} />
    }

    // if (user.__id === authuser.__id) {
    //   useraction = (
    //     <label htmlFor="imageUpload" className="btn btn-light">
    //       <i className="fas fa-pen text-info mr-1" />
    //       Edit User
    //     </label>
    //   )
    // }



    // if (this.props.auth.isAuthenticated) {
    //   if (college.deleted === 0) {
    //     courseAction = <CollegeCourseActions />;
    //   }
    //   colAction = <CollegeActions />;
    // }

    if (user === null || loading) {
      userContent = <Spinner />;
    } else {
      try {
        userContent = (
          <div>
            <div hidden>
              <p>{user.name.firstName} {user.name.middleName} {user.name.lastName}</p>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Link to="/viewusers" className="btn btn-light mb-3 float-left">
                  <i className="fas fa-angle-left" /> Back to Accounts
                </Link>
              </div>
              <div className="col-md-6" />
            </div>
            <ViewUserHeader user={user} />
            {useraction}

            <ViewUserDetails user={user} />

          </div>
        );
      } catch (error) { }
    }

    return (

      <div className="user">


        <div className="container">

          <div className="row">
            <div className="col-md-12">{userContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

ViewUser.propTypes = {
  users: PropTypes.object.isRequired,
  getUserById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getUserById }
)(ViewUser);
