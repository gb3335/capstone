import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

class ViewUserDetails extends Component {
  render() {
    const { user, invitedBy } = this.props;
    const status =
      user.isBlock === 0 ? (
        <span className="badge badge-success">Active</span>
      ) : (
        <span className="badge badge-danger">Deactivated</span>
      );

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3 shadow">
            <h3 className="text-center text-info">Information</h3>
            <hr />
            <div className="row">
              <div className="col-md-4">
                <p className="infoText ">
                  <i className="fas fa-user-tag" />{" "}
                  <span>Account type: {user.userType}</span>
                </p>
                <p className="infoText">
                  <i className="fas fa-envelope-square" />{" "}
                  <span>Email address: {user.email}</span>
                </p>
              </div>
              <div className="col-md-4">
                <p className="infoText">
                  <i className="fas fa-phone" />{" "}
                  <span>Contact number: {user.contact}</span>
                </p>
                <p className="infoText">
                  <i className="fas fa-check-circle" />{" "}
                  <span>Status: {status}</span>
                </p>
              </div>
              <div className="col md-4">
                <p className="infoText">
                  <i className="fas fa-plus" />{" "}
                  <span>
                    Created at:{" "}
                    <Moment format="MMM. DD, YYYY">{user.date}</Moment>
                    {" at "}
                    <Moment format="h:mm A">{user.date}</Moment>
                  </span>
                </p>
                <p className="infoText">
                  <i className="fas fa-check-circle" />{" "}
                  <span>Invited by: {invitedBy}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewUserDetails;
