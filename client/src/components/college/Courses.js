import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteCourse } from "../../actions/collegeActions";

import "./College.css";
class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursebin: false
    };
  }

  onDeleteClick = course => {
    this.props.deleteCourse(course, this.props.history);
  };

  onRestoreClick = course => {
    this.props.deleteCourse(course, this.props.history);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ coursebin: nextProps.coursebin });
  }

  render() {
    const { college } = this.props.college;
    let course;

    if (this.props.auth.isAuthenticated === true) {
      if (this.state.coursebin) {
        if (college.deleted === 0) {
          // college not deleted with buttons
          course = this.props.course.map(cou =>
            // ternary operator if deleted do not show
            cou.deleted === 1 ? (
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
                  <div className="btn-group">
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
                      title="Edit Course"
                    >
                      <i
                        className="fas fa-pen text-light"
                        style={{ fontSize: "12px" }}
                      />
                    </Link>
                    {cou.researchTotal + cou.journalTotal === 0 ? (
                      <button
                        onClick={this.onRestoreClick.bind(
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
                        className="btn btn-success"
                        title="Restore Course"
                      >
                        <i
                          className="fas fa-recycle text-light"
                          style={{ fontSize: "12px" }}
                        />
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
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
        if (college.deleted === 0) {
          // college not deleted with buttons
          course = this.props.course.map(cou =>
            // ternary operator if active do not show
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
                  <div className="btn-group">
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
                      title="Edit Course"
                    >
                      <i
                        className="fas fa-pen text-light"
                        style={{ fontSize: "12px" }}
                      />
                    </Link>
                    {cou.researchTotal + cou.journalTotal === 0 ? (
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
                        title="Delete Course"
                      >
                        <i
                          className="fas fa-trash text-light"
                          style={{ fontSize: "12px" }}
                        />
                      </button>
                    ) : (
                      ""
                    )}
                    {cou.status === 0 ? (
                      <Link
                        to={{
                          pathname: "/add-research",
                          courseData: {
                            courseName: cou.name,
                            collegeName: this.props.college.college.name
                              .fullName,
                            fromCollege: true
                          }
                        }}
                        className="btn btn-primary"
                        title="Add research to this course"
                      >
                        <i
                          className="fas fa-plus text-light"
                          style={{ fontSize: "12px" }}
                        />
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              ""
            )
          );
        } else {
          // college deleted no buttons
          course = this.props.course.map(cou =>
            cou.deleted === 1 ? (
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

    // remove whitespace in course array
    const courseFiltered = course.filter(function(el) {
      return el !== "";
    });

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
          <tbody>{courseFiltered}</tbody>
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
  coursebin: state.college.coursebin,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteCourse }
)(withRouter(Courses));
