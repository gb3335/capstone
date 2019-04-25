import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import "./ViewUsers.css";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "material-ui-pickers";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import Modal from "react-modal";
import {
  getUserLogs,
  createReportForUserlogs
} from "../../actions/userActions";
import UserLogsAction from "./UserLogsAction";
import { Link } from "react-router-dom";

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

class UserLogs extends Component {
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
      userType: true,
      userName: true,
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
      this.state.userType === false &&
      this.state.userName === false &&
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
        typeOfReport: "Userlogs Report",
        printedBy: name,
        userType: this.state.userType,
        userName: this.state.userName,
        type: this.state.type,
        date: this.state.date,
        time: this.state.time
      };

      this.props.createReportForUserlogs(researchesReportData);
      //show generate alert
      this.setState({ generateAlert: true });
    }
    // onGenerateReport = rows => {

    //   const name =
    //     this.props.auth.user.name.firstName +
    //     " " +
    //     this.props.auth.user.name.middleName +
    //     " " +
    //     this.props.auth.user.name.lastName;

    //   const userlogsReport = {
    //     activities: rows,
    //     typeOfReport: "User Logs Report",
    //     printedBy: name
    //   };

    //   this.props.createReportForUserlogs(userlogsReport);
    //   // show generate alert
    //   this.setState({ generateAlert: true });
    // };
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

  componentDidMount() {
    this.props.getUserLogs();
  }

  componentWillMount() {
    this.props.getUserLogs();
  }

  render() {
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
    const { userlogs } = this.props.userlogs;
    const { users } = this.props.users;
    const { classes } = this.props;
    const { startDate, endDate } = this.state;
    const actLoading = this.props.userlogs.loading;
    let activityItems;
    let activityData = [];
    let names = [];

    if (userlogs === null || actLoading || userlogs === undefined) {
      activityItems = (
        <div className="row">
          <div className="col-md-12 mt-5 mb-5">
            <Spinner />
          </div>
        </div>
      );
    } else {
      // Add Names to array
      userlogs.map((userlogs, index) => {
        users.map(user => {
          if (userlogs.by === user._id) {
            names[index] = user.userName ? user.userName : user.email;
          }
        });
      });

      if (this.state.dates.length >= 1) {
        userlogs.map((userlogs, index) => {
          if (
            this.state.dates.includes(
              moment(userlogs.date).format("YYYY-MM-DD")
            ) &&
            this.state.times.includes(moment(userlogs.date).format("H:mm"))
          ) {
            activityData.push({
              userlogs: userlogs.userType,
              user:
                (names[index] === "") |
                (names[index] === null) |
                (names[index] === "undefined")
                  ? `Untracked`
                  : names[index],
              login:
                userlogs.type === "Login" ? (
                  <i
                    class="fas fa-check-circle text-success"
                    style={{ fontColor: "green" }}
                  />
                ) : (
                  ""
                ),
              logout:
                userlogs.type === "Logout" ? (
                  <i
                    class="fas fa-check-circle text-danger"
                    style={{ fontColor: "red" }}
                  />
                ) : (
                  ""
                ),
              date:
                userlogs.date + moment(userlogs.date).format("MMM. DD, YYYY"),
              time: moment(userlogs.date).format("h:mm A")
            });
          }
        });
      } else {
        activityData = userlogs.map((userlogs, index) =>
          true
            ? {
                userlogs: userlogs.userType,
                user:
                  (names[index] === "") |
                  (names[index] === null) |
                  (names[index] === "undefined")
                    ? `Untracked`
                    : names[index],
                login:
                  userlogs.type === "Login" ? (
                    <i
                      class="fas fa-check-circle text-success"
                      style={{ fontColor: "green" }}
                    />
                  ) : (
                    ""
                  ),
                logout:
                  userlogs.type === "Logout" ? (
                    <i
                      class="fas fa-check-circle text-danger"
                      style={{ fontColor: "red" }}
                    />
                  ) : (
                    ""
                  ),
                date:
                  userlogs.date + moment(userlogs.date).format("MMM. DD, YYYY"),
                time: moment(userlogs.date).format("h:mm A")
              }
            : {
                userlogs: null,
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
            { title: "Username", field: "user" },
            { title: "UserType", field: "userlogs" },
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
            },
            { title: "Login", field: "login" },
            { title: "Logout", field: "logout" }
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
          title="Userlogs"
        />
      );
    }
    return (
      <div className="userlogs">
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
                    name="userName"
                    id="userName"
                    value={this.state.userName}
                    onChange={this.onChange}
                    checked={this.state.userName}
                  />
                  <label className="form-check-label" htmlFor="userName">
                    Username
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="userType"
                    id="userType"
                    value={this.state.userType}
                    onChange={this.onChange}
                    checked={this.state.userType}
                  />
                  <label className="form-check-label" htmlFor="userType">
                    UserType
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

        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <UserLogsAction />
            <div className="usersBg ">
              <div className="light-overlay p-2">
                <div className="display-4 text-center mb-1">
                  User Log
                  <p className="lead text-center ">
                    List of all users login and logout
                  </p>
                </div>
              </div>
            </div>
            <br />
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
            <div className="tableClassname">{activityItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

UserLogs.protoTypes = {
  createReportForUserlogs: PropTypes.func.isRequired,
  getUserLogs: PropTypes.func.isRequired,
  userlogs: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  userlogs: state.userlogs,
  auth: state.auth,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getUserLogs, createReportForUserlogs }
)(withStyles(styles)(UserLogs));
