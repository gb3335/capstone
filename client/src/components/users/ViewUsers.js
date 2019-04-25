import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";

import { getUsers } from "../../actions/userActions";
import RegisterActions from "./RegisterActions";
import "./ViewUsers.css";

class ViewUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocked: false
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  componentWillMount() {
    this.props.getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ blocked: nextProps.blocked });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ blocked: nextProps.blocked });
  }

  render() {
    const { users, loading } = this.props.users;
    let userItems;
    let title;
    let info;
    const usersData = [];
    if (users === null || loading) {
      userItems = <Spinner />;
    } else {
      if (users.length > 0) {
        // const userData = users.map((user, index) => ({
        //   avatar: <img src={user.avatar} alt="" className="img-thumbnail rounded-circle img " />,
        //   username: user.name.firstName + " " + user.name.lastName,
        //   type: user.userType,
        //   view: (
        //     <Link to={/viewusers/ + user._id} ><div className="btn btn-info btn-sm ">View Account</div> </Link>
        //   ),
        //   blocked: whenBlock[index],
        //   college: user.college ? user.college : <div>None</div>
        // }));
        if (this.state.blocked) {
          users.map(user => {
            if (user.isBlock === 1) {
              if (user.superAdmin !== "true") {
                let path;
                if (user.avatar === "/images/User.png") {
                  path = "/images/User.png";
                } else {
                  path =
                    "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" +
                    user.avatar;
                }

                if (user._id !== this.props.auth.user.id) {
                  usersData.push({
                    avatar: (
                      <img
                        src={path}
                        alt=""
                        className="img-thumbnail user_img"
                      />
                    ),
                    username: user.name.firstName + " " + user.name.lastName,
                    type: user.userType,
                    view: (
                      <Link to={/viewusers/ + user._id}>
                        <div className="btn btn-outline-info btn-sm ">
                          View Account
                        </div>{" "}
                      </Link>
                    ),
                    blocked:
                      user.isBlock === 0 ? (
                        <div className="badge badge-success btn-sm">Active</div>
                      ) : (
                        <div className="badge badge-danger btn-sm ">
                          Blocked
                        </div>
                      ),
                    college: user.college ? user.college : <div>None</div>
                  });
                }
              }
            }
          });
          title = (
            <h1 className="display-4 text-danger text-center">Users Blocked</h1>
          );
          info = "List of Blocked Users";
        } else {
          users.map(user => {
            if (user.isBlock === 0) {
              if (user.superAdmin !== "true") {
                let path;
                if (user.avatar === "/images/User.png") {
                  path = "/images/User.png";
                } else {
                  path =
                    "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" +
                    user.avatar;
                }

                if (user._id !== this.props.auth.user.id) {
                  usersData.push({
                    avatar: (
                      <img
                        src={path}
                        alt=""
                        className="img-thumbnail user_img"
                      />
                    ),
                    username: user.name.firstName + " " + user.name.lastName,
                    type: user.userType,
                    view: (
                      <Link to={/viewusers/ + user._id}>
                        <div className="btn btn-outline-info btn-sm ">
                          View Account
                        </div>{" "}
                      </Link>
                    ),
                    blocked:
                      user.isBlock === 0 ? (
                        <div className="badge badge-success btn-sm">Active</div>
                      ) : (
                        <div className="badge badge-danger btn-sm ">
                          Blocked
                        </div>
                      ),
                    college: user.college ? user.college : <div>None</div>
                  });
                }
              }
            }
          });
          title = <h1 className="display-4 text-center">Users</h1>;
          info = "See all users and it's informations";
        }

        userItems = (
          <MaterialTable
            columns={[
              { title: "Avatar", field: "avatar" },
              { title: "Name", field: "username" },
              { title: "Type", field: "type" },
              { title: "College", field: "college" },
              { title: "Status", field: "blocked" },
              { title: "View Account", field: "view" }
            ]}
            options={{
              pageSizeOptions: [10, 20, 30, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 30
            }}
            data={usersData}
            title="User Data"
          />
        );
      } else {
        userItems = <h4>No users found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <div className="usersBg">
              <div className="light-overlay">
                {title}
                <p className="lead text-center">{info}</p>
              </div>
            </div>
            <br />
            <RegisterActions />
            <div className="tableClassname">{userItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

ViewUsers.protoTypes = {
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,
  blocked: state.users.blocked
});

export default connect(
  mapStateToProps,
  { getUsers }
)(ViewUsers);
