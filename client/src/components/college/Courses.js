import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteCourse } from "../../actions/collegeActions";

import "./College.css";
class Courses extends Component {
  onDeleteClick = (college, id) => {
    //this.props.deleteCourse(college, id);
    console.log("REMOVE");
  };

  onEditClick = (college, id) => {
    //this.props.editCourse(college, id);
    console.log("EDIT");
  };

  render() {
    const { college } = this.props.college;
    let course;

    if (this.props.auth.isAuthenticated === true) {
      if (college.deleted === 0) {
        course = this.props.course.map(cou => (
          <tr key={cou._id}>
            <td>{cou.name}</td>
            <td>{cou.initials}</td>
            <td>
              {cou.status === 0 ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <span className="badge badge-danger">Not Active</span>
              )}
            </td>
            <td>{cou.researchTotal}</td>
            <td>{cou.journalTotal}</td>
            <td>
              <Link
                to={{
                  pathname: "/edit-course",
                  course: {
                    courseName: cou.name,
                    courseInitials: cou.initials,
                    courseTotalRes: cou.researchTotal,
                    courseTotalJour: cou.journalTotal,
                    courseId: cou._id,
                    collegeId: college._id,
                    courseStatus: cou.status,
                    courseDeleted: cou.deleted
                  }
                }}
                className="btn btn-info"
              >
                <i
                  className="fas fa-pen text-light"
                  style={{ fontSize: "12px" }}
                />
              </Link>
              {" - "}
              <button
                onClick={this.onDeleteClick.bind(this, college._id, cou._id)}
                className="btn btn-danger"
              >
                <i
                  className="fas fa-trash text-light"
                  style={{ fontSize: "12px" }}
                />
              </button>
            </td>
          </tr>
        ));
      } else {
        course = this.props.course.map(cou => (
          <tr key={cou._id}>
            <td>{cou.name}</td>
            <td>{cou.initials}</td>
            <td>
              {cou.status === 0 ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <span className="badge badge-danger">Not Active</span>
              )}
            </td>
            <td>{cou.researchTotal}</td>
            <td>{cou.journalTotal}</td>
          </tr>
        ));
      }
    } else {
      course = this.props.course.map(cou => (
        <tr key={cou._id}>
          <td>{cou.name}</td>
          <td>{cou.initials}</td>
          <td>
            {cou.status === 0 ? (
              <span className="badge badge-success">Active</span>
            ) : (
              <span className="badge badge-danger">Not Active</span>
            )}
          </td>
          <td>{cou.researchTotal}</td>
          <td>{cou.journalTotal}</td>
        </tr>
      ));
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            borderSpacing: 0,
            width: "100%",
            border: "1px solid #ddd"
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Initials</th>
              <th>Status</th>
              <th>Researches</th>
              <th>Journals</th>
              <th />
            </tr>
          </thead>
          <tbody>{course}</tbody>
        </table>
      </div>
    );
  }
}

Courses.propTypes = {
  deleteCourse: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteCourse }
)(Courses);
