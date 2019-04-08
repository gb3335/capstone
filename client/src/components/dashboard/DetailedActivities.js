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

const customStylesFilter = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "340px",
    height: "320px"
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
      checkOneAlert: false,

      // Modals
      modalIsOpen: false,
      filterModal: false,

      // Date
      startDate: new Date("2019-01-01T00:00:00"),
      endDate: new Date("2019-01-01T23:59:00"),
      dates: [],
      times: [],

      // Filter
      action: true,
      username: true,
      type: true,
      date: true,
      time: true,
      selectedRows: []
    };
  }

  componentDidMount() {
    if (this.props.activity.activities === null) {
      this.props.getActivities();
    }
  }

  // Alerts
  onGenerateAlert = () => {
    this.setState({ generateAlert: false, filterModal: false });
  };

  // alert confirms
  onCheckOneAlert = () => {
    this.setState({ checkOneAlert: false });
  };

  onGenerateReport = () => {
    if (
      this.state.action === false &&
      this.state.username === false &&
      this.state.type === false &&
      this.state.date === false &&
      this.state.time === false
    ) {
      this.setState({ checkOneAlert: true });
    } else {
      const name =
        this.props.auth.user.name.firstName +
        " " +
        this.props.auth.user.name.middleName +
        " " +
        this.props.auth.user.name.lastName;

      const researchesReportData = {
        activities: this.state.selectedRows,
        typeOfReport: "Activities Report",
        printedBy: name,
        action: this.state.action,
        username: this.state.username,
        type: this.state.type,
        date: this.state.date,
        time: this.state.time
      };

      this.props.createReportForActivity(researchesReportData);
      //show generate alert
      this.setState({ generateAlert: true });
    }
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
    this.setState({ modalIsOpen: false, filterModal: false });
  };

  getDates = () => {
    var dateArray = [];
    var startDate = moment(this.state.startDate);
    var stopDate = moment(this.state.endDate);
    while (startDate <= stopDate) {
      dateArray.push(moment(startDate).format("YYYY-MM-DD"));
      startDate = moment(startDate).add(1, "days");
    }

    var timeArray = [];
    var startTime = moment(this.state.startDate);
    var stopTime = moment(this.state.endDate);
    while (startTime <= stopTime) {
      timeArray.push(moment(startTime).format("H:mm"));
      startTime = moment(startTime).add(1, "minutes");
    }

    this.setState({ dates: dateArray, times: timeArray, modalIsOpen: false });
  };

  onChange = e => {
    let bool;
    if (e.target.value === "false") {
      bool = true;
    } else {
      bool = false;
    }
    this.setState({ [e.target.name]: bool });
  };

  render() {
    const { activities } = this.props.activity;
    const { users } = this.props.users;
    const { classes } = this.props;
    const { startDate, endDate } = this.state;
    const actLoading = this.props.activity.loading;
    let activityItems;
    let activityData = [];
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
            names[index] = user.userName;
          }
        });
      });

      if (this.state.dates.length >= 1) {
        activities.map((activity, index) => {
          if (
            this.state.dates.includes(
              moment(activity.date).format("YYYY-MM-DD")
            ) &&
            this.state.times.includes(moment(activity.date).format("H:mm"))
          ) {
            activityData.push({
              activity: activity.title,
              user: names[index],
              type: activity.type,
              date:
                activity.date + moment(activity.date).format("MMM. DD, YYYY"),
              time: moment(activity.date).format("h:mm A")
            });
          }
        });
      } else {
        activityData = activities.map((activity, index) =>
          true
            ? {
                activity: activity.title,
                user: names[index],
                type: activity.type,
                date:
                  activity.date + moment(activity.date).format("MMM. DD, YYYY"),
                time: moment(activity.date).format("h:mm A")
              }
            : {
                activity: null,
                user: null,
                type: null,
                date: null,
                time: null
              }
        );
      }

      activityItems = (
        <MaterialTable
          columns={[
            { title: "Action", field: "activity" },
            { title: "Username", field: "user" },
            { title: "Type", field: "type" },
            {
              title: "Date",
              field: "date",
              render: rowData => {
                const date = moment(rowData.date.substr(0, 24)).format(
                  "MMM. DD, YYYY"
                );
                return date;
              }
            },
            {
              title: "Time",
              field: "time"
            }
          ]}
          options={{
            pageSizeOptions: [10, 20, 30, 50, 100],
            emptyRowsWhenPaging: false,
            pageSize: 30,
            selection: true
          }}
          actions={[
            {
              icon: "print",
              tooltip: "Generate Report",
              onClick: (event, rows) => {
                this.setState({ selectedRows: rows, filterModal: true });
                // this.onGenerateReport(rows);
              }
            }
          ]}
          data={activityData}
          title="Activities"
        />
      );
    }

    return (
      <div>
        {/* ALERTS */}
        {/* PLEASE CHECK ONE ALERT */}
        <SweetAlert
          show={this.state.checkOneAlert}
          warning
          title="Oops!"
          onConfirm={this.onCheckOneAlert}
        >
          Please check at least one
        </SweetAlert>

        {/* GENERATE REPORT ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>

        {/* DATE MODAL */}
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
              value="Cancel"
              onClick={() => this.setState({ modalIsOpen: false })}
              className="btn btn-danger"
            />{" "}
            <input
              type="button"
              value="Okay"
              onClick={() => this.getDates()}
              className="btn btn-info"
            />
          </div>
        </Modal>

        {/* FILTER MODAL */}

        <Modal
          isOpen={this.state.filterModal}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStylesFilter}
          contentLabel="Example Modal"
        >
          <div className="row">
            <div className="col-12">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Create Report
              </h2>
              <div>
                <h4>Filter</h4>
              </div>
              <form>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="action"
                    id="action"
                    value={this.state.action}
                    onChange={this.onChange}
                    checked={this.state.action}
                  />
                  <label className="form-check-label" htmlFor="action">
                    Action
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="username"
                    id="username"
                    value={this.state.username}
                    onChange={this.onChange}
                    checked={this.state.username}
                  />
                  <label className="form-check-label" htmlFor="username">
                    Username
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="type"
                    id="type"
                    value={this.state.type}
                    onChange={this.onChange}
                    checked={this.state.type}
                  />
                  <label className="form-check-label" htmlFor="type">
                    Type
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="date"
                    id="date"
                    value={this.state.date}
                    onChange={this.onChange}
                    checked={this.state.date}
                  />
                  <label className="form-check-label" htmlFor="date">
                    Date
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="time"
                    id="time"
                    value={this.state.time}
                    onChange={this.onChange}
                    checked={this.state.time}
                  />
                  <label className="form-check-label" htmlFor="time">
                    Time
                  </label>
                </div>
                <br />
                <input
                  type="button"
                  value="Cancel"
                  onClick={this.closeModal}
                  className="btn btn-danger"
                />{" "}
                <input
                  type="button"
                  value="Generate Report"
                  onClick={this.onGenerateReport}
                  className="btn btn-info"
                />
              </form>
            </div>
          </div>
        </Modal>

        {/* MAIN */}
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-6">
            <Link to="/dashboard" className="btn btn-light mb-3 float-left">
              <i className="fas fa-angle-left" /> Back to Dashboard
            </Link>
          </div>
          <div className="col-md-6" />
        </div>
        <h1 className="display-4 text-center">Audit Trail</h1>
        <p className="lead text-center">Detailed View of Recent Activities</p>
        <div style={{ margin: "15px" }}>
          <div className="btn-group mb-3 btn-group-sm" role="group">
            <Link
              to="#"
              onClick={this.openModal}
              // onClick={() => this.setState({ dateAlert: true })}
              className="btn btn-light"
            >
              <i className="fas fa-calendar-alt text-info mr-1" /> Pick Dates
            </Link>
            <Link
              to="#"
              onClick={() =>
                this.setState({
                  dates: [],
                  startDate: new Date("2019-01-01T00:00:00"),
                  endDate: new Date("2019-01-01T23:59:00")
                })
              }
              // onClick={() => this.setState({ dateAlert: true })}
              className="btn btn-light"
            >
              <i className="fas fa-redo-alt text-info mr-1" /> Reset Dates
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
