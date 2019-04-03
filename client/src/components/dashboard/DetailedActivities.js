import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";

import {
  getActivities,
  createReportForActivity
} from "../../actions/activityActions";

class DetailedActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for alerts
      generateAlert: false
    };
  }

  componentDidMount() {
    if (this.props.activity.activities === null) {
      this.props.getActivities();
    }
  }

  onGenerateAlert = () => {
    this.setState({ generateAlert: false });
  };

  onGenerateReport = rows => {
    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    const researchesReportData = {
      activities: rows,
      typeOfReport: "Activities Report",
      printedBy: name
    };

    this.props.createReportForActivity(researchesReportData);
    // show generate alert
    this.setState({ generateAlert: true });
  };

  render() {
    const { activities } = this.props.activity;
    const { users } = this.props.users;
    const actLoading = this.props.activity.loading;
    let activityItems;
    let activityData;
    let name = "";
    let names = [];

    if (activities === null || actLoading || activities === undefined) {
      activityItems = (
        <div className="row">
          <div className="col-md-12 mt-5 mb-5">
            <Spinner />
          </div>
        </div>
      );
    } else {
      // Add Names to array
      activities.map(activity => {
        users.map(user => {
          if (activity.by === user._id) {
            names.push(
              (name =
                user.name.firstName +
                " " +
                user.name.middleName +
                " " +
                user.name.lastName)
            );
          }
        });
      });
      console.log(names);

      activityData = activities.map((activity, index) =>
        true
          ? {
              activity: activity.title,
              user: names[index],
              type: activity.type,
              date:
                activity.date +
                moment(activity.date).format("MMMM Do YYYY, h:mm A")
            }
          : {
              activity: null,
              user: null,
              type: null,
              date: null
            }
      );

      activityItems = (
        <MaterialTable
          columns={[
            { title: "Activity", field: "activity" },
            { title: "User", field: "user" },
            { title: "Type", field: "type" },
            {
              title: "Date",
              field: "date",
              render: rowData => {
                const date = moment(rowData.date.substr(0, 24)).format(
                  "MMMM Do YYYY, h:mm A"
                );
                return date;
              }
            }
          ]}
          options={{
            pageSizeOptions: [10, 20, 30, 50, 100],
            emptyRowsWhenPaging: false,
            pageSize: 30,
            columnsButton: true,
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
          data={activityData}
          title="Researches"
        />
      );
    }
    return (
      <div>
        {/* ALERTS */}
        {/* GENERATE REPORT ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>
        <h1 className="display-4 text-center">Recent Activites</h1>
        <p className="lead text-center">Detailed View of Recent Activities</p>
        <div style={{ margin: "15px" }}>{activityItems}</div>
      </div>
    );
  }
}

DetailedActivities.propTypes = {
  getActivities: PropTypes.func.isRequired,
  createReportForActivity: PropTypes.func.isRequired,
  activity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  activity: state.activity,
  auth: state.auth,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getActivities, createReportForActivity }
)(DetailedActivities);
