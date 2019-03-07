import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteCourse } from "../../actions/collegeActions";

import "./College.css";
class Courses extends Component {
  onDeleteClick = course => {
    this.props.deleteCourse(course, this.props.history);
  };

  render() {
    const { college } = this.props.college;
    let course;

    if (this.props.auth.isAuthenticated === true) {
      if (college.deleted === 0) {
        // college not deleted with buttons
        course = this.props.course.map(cou =>
          // ternary operator if deleted do not show
          cou.deleted === 0 ? (
            <tr key={cou._id}>
              <td>{cou.name}</td>
              <td>{cou.initials}</td>
              <td>
                {cou.deleted === 1 ? (
                  <span className="badge badge-danger">Deleted</span>
                ) : cou.status === 0 ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-danger">Inactive</span>
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
                  onClick={this.onDeleteClick.bind(
                    this,
                    (course = {
                      courseName: cou.name,
                      courseInitials: cou.initials,
                      courseTotalRes: cou.researchTotal,
                      courseTotalJour: cou.journalTotal,
                      courseId: cou._id,
                      collegeId: college._id,
                      courseStatus: cou.status,
                      courseDeleted: cou.deleted,
                      collegeInit: college.name.initials
                    })
                  )}
                  className="btn btn-danger"
                >
                  <i
                    className="fas fa-trash text-light"
                    style={{ fontSize: "12px" }}
                  />
                </button>
              </td>
            </tr>
          ) : (
            ""
          )
        );
      } else {
        // college deleted no buttons
        course = this.props.course.map(cou =>
          cou.deleted === 0 ? (
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
          ) : (
            ""
          )
        );
      }
    } else {
      // Not logged in no buttons
      course = this.props.course.map(cou =>
        cou.deleted === 0 ? (
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
        ) : (
          ""
        )
      );
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
)(withRouter(Courses));
