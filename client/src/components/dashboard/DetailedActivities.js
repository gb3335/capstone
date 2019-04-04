import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "material-ui-pickers";
import Modal from "react-modal";

import {
  getActivities,
  createReportForActivity
} from "../../actions/activityActions";

const customStyles = {
  content: {
    top: "53%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "55%",
    height: "440px"
  }
};

Modal.setAppElement("#root");

const styles = {
  grid: {
    width: "60%"
  }
};

class DetailedActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for alerts
      generateAlert: false,
      dateAlert: false,
      // Date
      startDate: new Date("2019-01-01T12:00:00"),
      endDate: new Date("2019-01-01T12:00:00"),
      modalIsOpen: false
    };
  }

  componentDidMount() {
    if (this.props.activity.activities === null) {
      this.props.getActivities();
    }
  }

  // Alerts
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

  // Date Picker
  handleDateChangeStart = date => {
    this.setState({ startDate: date });
  };

  handleDateChangeEnd = date => {
    this.setState({ endDate: date });
  };

  // Modal
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#2874A6";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { activities } = this.props.activity;
    const { users } = this.props.users;
    const { classes } = this.props;
    const { startDate, endDate } = this.state;
    const actLoading = this.props.activity.loading;
    let activityItems;
    let activityData;
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
      activities.map((activity, index) => {
        users.map(user => {
          if (activity.by === user._id) {
            names[index] =
              user.name.firstName +
              " " +
              user.name.middleName +
              " " +
              user.name.lastName;
          }
        });
      });

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
        {/* DATE ALERT */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div>
            <h3 ref={subtitle => (this.subtitle = subtitle)}>Pick Dates</h3>
            <div>
              <h6>Choose dates to filter in-between</h6>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="card">
                  <h5 className="card-header">Start Date</h5>
                  <div className="card-body">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container className={classes.grid}>
                        <DatePicker
                          margin="normal"
                          label="Date picker"
                          value={startDate}
                          onChange={this.handleDateChangeStart}
                          style={{ fontSize: "10px" }}
                        />
                        <TimePicker
                          margin="normal"
                          label="Time picker"
                          value={startDate}
                          onChange={this.handleDateChangeStart}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
                <br />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="card">
                  <h5 className="card-header">End Date</h5>
                  <div className="card-body">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid
                        container
                        className={classes.grid}
                        justify="space-around"
                      >
                        <DatePicker
                          margin="normal"
                          label="Date picker"
                          value={endDate}
                          onChange={this.handleDateChangeEnd}
                        />
                        <TimePicker
                          margin="normal"
                          label="Time picker"
                          value={endDate}
                          onChange={this.handleDateChangeEnd}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <input
              type="button"
              value="Okay"
              onClick={() =>
                console.log(
                  "Start: ",
                  this.state.startDate,
                  " End: ",
                  this.state.endDate
                )
              }
              className="btn btn-info"
            />
          </div>
        </Modal>
        {/* MAIN */}
        <h1 className="display-4 text-center">Recent Activites</h1>
        <p className="lead text-center">Detailed View of Recent Activities</p>
        <div style={{ margin: "15px" }}>
          <div className="btn-group mb-3 btn-group-sm" role="group">
            <Link
              to="#"
              onClick={this.openModal}
              // onClick={() => this.setState({ dateAlert: true })}
              className="btn btn-light"
            >
              <i className="fas fa-poll-h text-info mr-1" /> Pick Dates
            </Link>
          </div>
          {activityItems}
        </div>
      </div>
    );
  }
}

DetailedActivities.propTypes = {
  getActivities: PropTypes.func.isRequired,
  createReportForActivity: PropTypes.func.isRequired,
  activity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  activity: state.activity,
  auth: state.auth,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getActivities, createReportForActivity }
)(withStyles(styles)(DetailedActivities));
