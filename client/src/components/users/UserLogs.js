import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import './ViewUsers.css';
import moment from "moment";


import { getUserLogs, createReportForUserlogs } from "../../actions/userActions";
import UserLogsAction from "./UserLogsAction";

class UserLogs extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.props.getUserLogs();
  }

  componentWillMount() {
    this.props.getUserLogs();

  }

  onGenerateReport = rows => {

    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    const userlogsRepor = {
      activities: rows,
      typeOfReport: "User Logs Report",
      printedBy: name
    };

    this.props.createReportForUserlogs(userlogsRepor);
    // show generate alert
    this.setState({ generateAlert: true });
  };


  render() {

    String.prototype.getInitials = function (glue) {
      if (typeof glue == "undefined") {
        var glue = true;
      }

      var initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

      if (glue) {
        return initials.join('.');
      }

      return initials;
    };


    const { userlogs, loading } = this.props.userlogs;
    const { users } = this.props.users;
    let userlogData;
    let userlogItems;
    let names = [];

    if (userlogs === null || loading) {
      userlogItems = <Spinner />
    } else {
      userlogs.map((log, index) => {
        users.map(user => {
          if (log.by === user._id) {
            names[index] =
              user.name.firstName +
              " " +
              user.name.middleName.getInitials() +
              ". " +
              user.name.lastName;
          }
        });
      });

      if (userlogs.length > 0) {
        if (this.props.auth.isAuthenticated) {
          userlogData = userlogs.map((userlog, index) => {
            return {
              date:
                moment(userlog.date).format(
                  "MMMM Do YYYY, h:mm A"
                ),
              user: names[index]
              ,
              //userlog.name.firstName + " " + userlog.name.middleName.getInitials() + ". " + userlog.name.lastName,
              type: userlog.type,
              userType: userlog.userType
            }
          }
          );
        }
      }

      if (userlogData) {
        userlogData.map((data, index) => {
          if (data.date === null) {
            userlogData.splice(index, 1);
          }
        });
      }

      userlogItems = (
        <MaterialTable
          columns={[
            { title: "Date", field: "date", defaultGroupSort: "desc" },
            { title: "Name", field: "user", defaultGroupSort: "desc" },
            { title: "Type of user", field: "userType", defaultGroupSort: "desc" },
            { title: "Activity", field: "type", defaultGroupSort: "desc" },
            // defaultGroupOrder: 0, defaultGroupSort: "desc"
          ]}
          options={{
            pageSizeOptions: [10, 20, 30, 50, 100],
            emptyRowsWhenPaging: false,
            columnsButton: true,
            pageSize: 30,
            grouping: true,
            selection: true
          }}
          actions={[
            {
              icon: "print",
              tooltip: "Generate Report",
              onClick: (event, rows) => {
                this.onGenerateReport(rows);
              }
            }
          ]}
          data={userlogData}
          title="Userlogs"
        />
      );

    }





    return (
      <div className="userlogs">

        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <div className="usersBg ">
              <div className="light-overlay p-2">
                <div className="display-4 text-center mb-1">User Log
                <p className="lead text-center ">
                    List of all users login
                </p>

                </div>
              </div>
            </div>
            <br />
            <UserLogsAction />
            {userlogItems}
          </div>
        </div>
      </div>




    )
  }
}

UserLogs.protoTypes = {
  createReportForUserlogs: PropTypes.func.isRequired,
  getUserLogs: PropTypes.func.isRequired,
  userlogs: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
}

const mapStateToProps = state => ({

  userlogs: state.userlogs,
  auth: state.auth,
  users: state.users,
})

export default connect(mapStateToProps, { getUserLogs, createReportForUserlogs })(UserLogs);