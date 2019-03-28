import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import Moment from "react-moment";
import SweetAlert from "react-bootstrap-sweetalert";
import "moment-timezone";

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
      this.props.auth.user.firstName +
      " " +
      this.props.auth.user.middleName +
      " " +
      this.props.auth.user.lastName;

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
    const actLoading = this.props.activity.loading;
    let activityItems;
    let activityData;

    if (activities === null || actLoading || activities === undefined) {
      activityItems = (
        <div className="row">
          <div className="col-md-12 mt-5 mb-5">
            <Spinner />
          </div>
        </div>
      );
    } else {
      activityData = activities.map(activity =>
        true
          ? {
              activity: activity.title,
              user: activity.by,
              type: activity.type,
              date:
                activity.date.substring(0, 10) +
                " at " +
                activity.date.substring(11, 16)
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
            { title: "Date", field: "date" }
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
        <div className="container">{activityItems}</div>
      </div>
    );
  }
}

DetailedActivities.propTypes = {
  getActivities: PropTypes.func.isRequired,
  createReportForActivity: PropTypes.func.isRequired,
  activity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  activity: state.activity,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getActivities, createReportForActivity }
)(DetailedActivities);
