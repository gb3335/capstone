import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";

import { getUserById } from "../../actions/userActions";
import ViewUserHeader from "./ViewUserHeader";
import ViewUserDetails from "./ViewUserDetails";
import MyAccountAction from "./MyAccountAction";
// import CollegeHeader from "./CollegeHeader";
// import CollegeDetails from "./CollegeDetails";
// import CollegeCourses from "./CollegeCourses";
// import CollegeActions from "./CollegeActions";
// import CollegeCourseActions from "./CollegeCourseActions";

class MyAccount extends Component {
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
    const { loading, users } = this.props.users;
    const { user } = this.props.auth;
    const auth = this.props.auth;
    const isAuthenticated = this.props.auth.isAuthenticated;

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
        if (sixthOccurencePath === "0000") {
          oldlink = "/";
        } else {
          oldlink = `/${getlink}`;
        }
      } else {
        oldlink = `/${getlink}/${sixthOccurencePath}`;
      }
    }

    let userContent;
    let useraction;
    let userstatus;

    if (isAuthenticated) {
      useraction = <MyAccountAction user={user} auth={auth} />;
    }

    let recentUrl = this.props.match.params.oldurl;
    let backurl;

    if (recentUrl) {
      if (
        (this.props.match.params.oldid === "undefined") |
        (this.props.match.params.oldid === null) |
        (this.props.match.params.oldid === "")
      ) {
        if (
          (this.props.match.params.oldurl === "undefined") |
          (this.props.match.params.oldurl === null) |
          (this.props.match.params.oldurl === "")
        ) {
          backurl = "";
        } else {
          backurl = this.props.match.params.oldurl;
        }
      } else {
        backurl =
          this.props.match.params.oldurl + "/" + this.props.match.params.oldid;
      }
    }

    String.prototype.getInitials = function(glue) {
      if (typeof glue == "undefined") {
        var glue = true;
      }

      var initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

      if (glue) {
        return initials.join(".");
      }

      return initials;
    };
    let invitedBy;
    users.map(user => {
      if (user._id === this.props.auth.user.invitedBy) {
        invitedBy =
          user.name.firstName +
          " " +
          (user.name.middleName
            ? user.name.middleName.getInitials() + "."
            : "") +
          " " +
          user.name.lastName;
      }
    });

    if (user === null || loading) {
      userContent = <Spinner />;
    } else {
      try {
        userContent = (
          <div>
            <div hidden>
              <p>
                {user.name.firstName}{" "}
                {user.name.middleName ? user.name.middleName : ""}{" "}
                {user.name.lastName}
              </p>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Link to={oldlink} className="btn btn-light mb-3 float-left">
                  <i className="fas fa-angle-left" /> Go Back
                </Link>
              </div>
              <div className="col-md-6" />
            </div>
            <ViewUserHeader user={user} />
            {useraction}

            <ViewUserDetails user={user} invitedBy={invitedBy} />
          </div>
        );
      } catch (error) {}
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

MyAccount.propTypes = {
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
)(MyAccount);
