import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { getUser } from "../../actions/userActions";

class Users extends Component {
  componentWillMount() {
    this.props.getUser();
  }

  componentDidMount() {
    this.props.getUser();
  }
  render() {
    const { users } = this.props.user;
    let userItems;
    if (users.length > 0) {
      const userData = users.map(user => ({
        college: user.college,

        view: (
          <Link to={/users/ + user._id} className="btn btn-outline-info btn-sm">
            View Details
          </Link>
        )
      }));

      userItems = (
        <MaterialTable
          columns={[
            { title: "Title", field: "title" },
            { title: "College", field: "college" },
            { title: "Course", field: "course" },
            { title: "View Details", field: "view" }
          ]}
          data={researchData}
          title="Researches"
        />
      );
    } else {
      researchItems = <h4>No research found</h4>;
    }

    return (
      <div className="researches">
        <div className="container">
          <div className="row">
            <div className="usersBg">
              <div className="light-overlay">
                Users
                <p className="lead text-center">User list of accounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
