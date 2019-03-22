
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";

import { getUsers } from "../../actions/userActions";
import RegisterActions from "./RegisterActions";
import './ViewUsers.css';


class ViewUsers extends Component {

  constructor() {
    super();
    this.state = {
      delPanel: null,
      delItems: [],
      passwordField: '',
      blockPanel: null
    };
  }


  componentDidMount() {
    this.props.getUsers();
  }
  componentWillMount() {
    this.props.getUsers();

  }


  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });

  };




  render() {



    const { users, loading } = this.props.users;
    let userItems;

    if (users === null || loading) {
      userItems = <Spinner />
    } else {




      if (users.length > 0) {

        const styles = {
          avatar: {
            margin: 10,
          },
          bigAvatar: {
            margin: 10,
            width: 60,
            height: 60,
          },
        };

        const whenBlock = users.map(user => {


          if (user.isBlock === 0) {
            return (<div className="badge badge-success btn-sm">Active</div >
            )
          }
          else if (user.isBlock === 1) {
            return (<div className="badge badge-danger btn-sm " >
              Inactive</div >
            )
          }


        })

        const userData = users.map((user, index) => ({
          avatar: <img src={user.avatar} alt="" className="img-thumbnail rounded-circle img " />,
          username: user.name.firstName + " " + user.name.lastName,
          type: user.userType,
          view: (
            <Link to={/viewusers/ + user._id} ><div className="btn btn-info btn-sm ">View Account</div> </Link>

          ),
          blocked: whenBlock[index],
          college: user.college ? user.college : <div>None</div>


        }));





        userItems = (

          <MaterialTable
            columns={[
              { title: "Avatar", field: "avatar" },
              { title: "Name", field: "username" },
              { title: "Type", field: "type" },
              { title: "College", field: "college" },
              { title: "Status", field: "blocked" },
              { title: "View Details", field: "view" }
            ]}
            data={userData}
            title="User Data"
          />
        );
      }



      else {
        userItems = <h4>No users found...</h4>
      }
    }

    return (


      <div className="profiles">
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <div className="usersBg ">
              <div className="light-overlay p-2">
                <div className="display-4 text-center mb-1">Users
                <p className="lead text-center ">
                    User list of Accounts
                </p>

                </div>
              </div>
            </div>
            <br />
            <RegisterActions />
            {userItems}
          </div>
        </div>
      </div>




    )
  }
}

ViewUsers.protoTypes = {
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,

})

export default connect(mapStateToProps, { getUsers })(ViewUsers);