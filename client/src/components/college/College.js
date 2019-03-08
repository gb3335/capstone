import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";

import {
  getCollegeByInitials,
  deleteCollege,
  restoreCollege
} from "../../actions/collegeActions";

import CollegeHeader from "./CollegeHeader";
import CollegeDetails from "./CollegeDetails";
import CollegeCourses from "./CollegeCourses";
import CollegeActions from "./CollegeActions";
import Report from "./Report";
import CollegeCourseActions from "./CollegeCourseActions";

class College extends Component {
  componentWillMount() {
    if (this.props.match.params.initials) {
      console.log("dfg");
      this.props.getCollegeByInitials(this.props.match.params.initials);
    }
  }

  componentDidMount() {
    if (this.props.match.params.initials) {
      console.log("asd");
      this.props.getCollegeByInitials(this.props.match.params.initials);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.college.college === null && this.props.college.loading) {
      this.props.history.push("/not-found");
    }
  }

  onDeleteCollege = e => {
    e.preventDefault();

    const data = {
      id: this.props.college.college._id,
      logo: this.props.college.college.logo
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

  onRestoreCollege = e => {
    e.preventDefault();

    const data = {
      id: this.props.college.college._id,
      logo: this.props.college.college.logo
    };

    this.props.restoreCollege(data, this.props.history);
  };

  render() {
    let { college, loading } = this.props.college;

    let collegeDetails;
    let collegeCourses;
    let collegeReports;
    let collegeContent;
    let colAction;
    let courseAction;
    let deletedAction;
    let statusAction;

    try {
      if (this.props.auth.isAuthenticated) {
        try {
          if (college.deleted === 0) {
            courseAction = <CollegeCourseActions />;
          }
          colAction = <CollegeActions />;
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

          collegeReports = <Report />;

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
      try {
        if (college.deleted === 1) {
          deletedAction = (
            <a
              className="list-group-item list-group-item-action btn btn-success"
              href="#bin"
              role="tab"
              onClick={this.onRestoreCollege}
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
              onClick={this.onDeleteCollege}
            >
              <i className="fas fa-trash mr-2" />
              Move to Bin
            </a>
          );
        }
      } catch (error) {}
    } catch (error) {}
    return (
      <div className="college">
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
          <div className="col-md-4">
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
                <i className="fas fa-university mr-2" />
                Courses
              </a>
              {deletedAction}
              <a
                className="list-group-item list-group-item-action"
                id="list-reports-list"
                data-toggle="list"
                href="#list-reports"
                role="tab"
                aria-controls="reports"
              >
                <i className="fas fa-poll-h mr-2" />
                Reports
              </a>
            </div>
          </div>

          <div className="col-md-8">
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
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCollegeByInitials, deleteCollege, restoreCollege }
)(College);
