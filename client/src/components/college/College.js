import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import SweetAlert from "react-bootstrap-sweetalert";

import {
  getCollegeByInitials,
  deleteCollege,
  restoreCollege
} from "../../actions/collegeActions";

import { getResearches } from "../../actions/researchActions";

import CollegeHeader from "./CollegeHeader";
import CollegeDetails from "./CollegeDetails";
import CollegeCourses from "./CollegeCourses";
import CollegeActions from "./CollegeActions";
import Report from "./Report";
import CollegeCourseActions from "./CollegeCourseActions";

class College extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Delete Alert
      deleteAlert: false,
      deleteAlertCancel: false,
      deleteAlertOkay: false,
      // Restore Alert
      restoreAlert: false,
      restoreAlertCancel: false,
      restoreAlertOkay: false
    };
  }

  componentWillMount() {
    if (this.props.match.params.initials) {
      this.props.getCollegeByInitials(this.props.match.params.initials);
    }
  }

  componentDidMount() {
    if (this.props.match.params.initials) {
      this.props.getCollegeByInitials(this.props.match.params.initials);
    }
    this.props.getResearches();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.college.college === null && this.props.college.loading) {
      this.props.history.push("/not-found");
    }
  }

  // Delete alerts
  onDeleteAlert = () => {
    this.setState({ deleteAlert: true });
  };
  onCancelDelete = () => {
    this.setState({ deleteAlert: false, deleteAlertCancel: true });
  };
  onRemoveDeleteCancel = () => {
    this.setState({ deleteAlertCancel: false });
  };
  onRemoveDeleteOkay = () => {
    this.setState({ deleteAlertOkay: false });
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.college.college._id,
      logo: this.props.college.college.logo,
      username: name
    };

    const totalResAndJour =
      parseInt(this.props.college.college.researchTotal, 10) +
      parseInt(this.props.college.college.journalTotal, 10);

    if (totalResAndJour === 0) {
      this.props.deleteCollege(data, this.props.history);
    } else {
      alert("This College cannot be deleted as this College have researches.");
    }
  };

  onDeleteCollege = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  // Restore Alerts
  onRestoreAlert = () => {
    this.setState({ restoreAlert: true });
  };
  onCancelRestore = () => {
    this.setState({ restoreAlert: false, restoreAlertCancel: true });
  };
  onRemoveRestoreCancel = () => {
    this.setState({ restoreAlertCancel: false });
  };
  onRemoveRestoreOkay = () => {
    this.setState({ restoreAlertOkay: false });
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.college.college._id,
      logo: this.props.college.college.logo,
      username: name
    };

    this.props.restoreCollege(data, this.props.history);
  };
  onRestoreCollege = () => {
    this.setState({ restoreAlertOkay: true, restoreAlert: false });
  };

  render() {
    let { college, loading } = this.props.college;

    let collegeDetails;
    let collegeCourses;
    let collegeReports;
    let collegeContent;
    let collegeReportButton;
    let colAction;
    let courseAction;
    let deletedAction;

    try {
      if (this.props.auth.isAuthenticated) {
        try {
          if (college.deleted === 0) {
            if (
              this.props.auth.user.userType === "ADMINISTRATOR" ||
              this.props.auth.user.id === this.props.college.college.librarianId
            ) {
              courseAction = <CollegeCourseActions />;
            }
          }
          if (
            this.props.auth.user.userType === "ADMINISTRATOR" ||
            this.props.auth.user.id === this.props.college.college.librarianId
          ) {
            colAction = <CollegeActions />;
          }
          if (
            this.props.auth.user.userType === "ADMINISTRATOR" ||
            this.props.auth.user.id === this.props.college.college.librarianId
          ) {
            collegeReports = <Report />;
            collegeReportButton = (
              <a
                className="list-group-item list-group-item-action"
                id="list-reports-list"
                data-toggle="list"
                href="#list-reports"
                role="tab"
                aria-controls="reports"
              >
                <i className="fas fa-poll-h mr-2" />
                Create Report
              </a>
            );
          }

          // delete / restore college action
          if (
            this.props.auth.user.userType === "ADMINISTRATOR" ||
            this.props.auth.user.id === this.props.college.college.librarianId
          ) {
            if (college.deleted === 1) {
              deletedAction = (
                <a
                  className="list-group-item list-group-item-action btn btn-success"
                  href="#bin"
                  role="tab"
                  onClick={this.onRestoreAlert}
                >
                  <i className="fas fa-recycle mr-2" />
                  Restore
                </a>
              );
            } else {
              deletedAction = (
                <a
                  className="list-group-item list-group-item-action btn btn-danger"
                  href="#bin"
                  role="tab"
                  onClick={this.onDeleteAlert}
                >
                  <i className="fas fa-trash mr-2" />
                  Move to Bin
                </a>
              );
            }
          }
          let delCtr = 0;
          college.course.map(cou => {
            if (cou.deleted === 0) {
              delCtr++;
            }
          });

          if (delCtr !== 0) {
            deletedAction = "";
          }
        } catch (error) {}
      }

      if (college === null || loading) {
        collegeContent = <Spinner />;
      } else {
        try {
          collegeContent = "";
          collegeDetails = (
            <div>
              <CollegeHeader college={college} />
              {colAction}
              <CollegeDetails college={college} />
            </div>
          );
          collegeCourses = (
            <div>
              {courseAction}
              <CollegeCourses college={college} />
            </div>
          );

          // collegeContent = (
          //   <div>
          //     <div hidden>
          //       <p>{college.name.fullName}</p>
          //     </div>

          //     <CollegeHeader college={college} />
          //     {colAction}
          //     <CollegeDetails college={college} />
          //     {courseAction}
          //     <CollegeCourses college={college} />
          //   </div>
          // );
        } catch (error) {}
      }
    } catch (error) {}
    return (
      <div className="college">
        {/* ALERTS */}
        {/* DELETE ALERT */}
        <SweetAlert
          show={this.state.deleteAlert}
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onDeleteCollege}
          onCancel={this.onCancelDelete}
        >
          Delete College?
        </SweetAlert>

        {/* CANCEL DELETE */}
        <SweetAlert
          show={this.state.deleteAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveDeleteCancel}
        >
          College is not deleted
        </SweetAlert>

        {/* COLLEGE DELETE */}
        <SweetAlert
          show={this.state.deleteAlertOkay}
          success
          title="Deleted"
          onConfirm={this.onRemoveDeleteOkay}
        >
          College deleted
        </SweetAlert>

        {/* RESTORE ALERT */}
        <SweetAlert
          show={this.state.restoreAlert}
          warning
          showCancel
          confirmBtnText="Yes, restore it!"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onRestoreCollege}
          onCancel={this.onCancelRestore}
        >
          Restore College?
        </SweetAlert>

        {/* CANCEL RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveRestoreCancel}
        >
          College is not restored
        </SweetAlert>

        {/* COLLEGE RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertOkay}
          success
          title="Restored"
          onConfirm={this.onRemoveRestoreOkay}
        >
          College restored
        </SweetAlert>

        {/* Back button */}
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-6">
            <Link to="/colleges" className="btn btn-light mb-3 float-left">
              <i className="fas fa-angle-left" /> Back to Colleges
            </Link>
          </div>
          <div className="col-md-6" />
        </div>
        {/* Back button */}
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-3">
            <br />
            <div className="list-group" id="list-tab" role="tablist">
              <a
                className="list-group-item list-group-item-action active"
                id="list-details-list"
                data-toggle="list"
                href="#list-details"
                role="tab"
                aria-controls="details"
              >
                <i className="fas fa-info-circle mr-2" />
                College Details
              </a>
              <a
                className="list-group-item list-group-item-action"
                id="list-courses-list"
                data-toggle="list"
                href="#list-courses"
                role="tab"
                aria-controls="courses"
              >
                <i className="fas fa-graduation-cap mr-2" />
                Courses
              </a>
              {collegeReportButton}
              {deletedAction}
            </div>
          </div>

          <div className="col-md-9">
            <br />
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="list-details"
                role="tabpanel"
                aria-labelledby="list-details-list"
              >
                {collegeContent}
                {collegeDetails}
              </div>
              <div
                className="tab-pane fade"
                id="list-courses"
                role="tabpanel"
                aria-labelledby="list-courses-list"
              >
                {collegeContent}
                {collegeCourses}
              </div>
              <div
                className="tab-pane fade"
                id="list-reports"
                role="tabpanel"
                aria-labelledby="list-reports-list"
              >
                {collegeContent}
                {collegeReports}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

College.propTypes = {
  deleteCollege: PropTypes.func.isRequired,
  restoreCollege: PropTypes.func.isRequired,
  getCollegeByInitials: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCollegeByInitials, deleteCollege, restoreCollege, getResearches }
)(College);
