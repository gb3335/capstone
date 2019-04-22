import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import sort from "fast-sort";
import SweetAlert from "react-bootstrap-sweetalert";

import { deleteCourse } from "../../actions/collegeActions";

import "./College.css";
class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursebin: false,
      course: {},
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

  componentWillReceiveProps(nextProps) {
    this.setState({ coursebin: nextProps.coursebin });
  }

  // Delete alerts
  onDeleteAlert = course => {
    this.setState({ deleteAlert: true, course: course });
  };
  onCancelDelete = () => {
    this.setState({ deleteAlert: false, deleteAlertCancel: true });
  };
  onRemoveDeleteCancel = () => {
    this.setState({ deleteAlertCancel: false });
  };

  onRemoveDeleteOkay = () => {
    this.setState({ deleteAlertOkay: false });
    this.props.deleteCourse(this.state.course, this.props.history);
  };

  onDeleteCourse = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  // Restore Alerts
  onRestoreAlert = course => {
    this.setState({ restoreAlert: true, course: course });
  };
  onCancelRestore = () => {
    this.setState({ restoreAlert: false, restoreAlertCancel: true });
  };
  onRemoveRestoreCancel = () => {
    this.setState({ restoreAlertCancel: false });
  };

  onRemoveRestoreOkay = () => {
    this.setState({ restoreAlertOkay: false });
    this.props.deleteCourse(this.state.course, this.props.history);
  };

  onRestoreCourse = () => {
    this.setState({ restoreAlertOkay: true, restoreAlert: false });
  };

  render() {
    const { college } = this.props.college;
    let course;
    let name;
    let courseFiltered;
    let courseText;
    let noCourses;
    let columnButton;
    try {
      name = this.props.auth.user.id;
    } catch (error) {}

    try {
      // Sorted Course
      let sortedCourse = sort(this.props.course).asc(u => u.name);

      if (
        this.props.auth.isAuthenticated === true &&
        (this.props.auth.user.userType === "ADMINISTRATOR" ||
          this.props.auth.user.id === this.props.college.college.librarianId)
      ) {
        columnButton = <th />;
        if (this.state.coursebin) {
          if (college.deleted === 0) {
            // college not deleted with buttons with restore
            course = sortedCourse.map(cou =>
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
                  <td style={{ paddingLeft: "3%" }}>{cou.researchTotal}</td>
                  <td style={{ paddingLeft: "3%" }}>{cou.journalTotal}</td>
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
                            collegeName: college.name.fullName,
                            courseStatus: cou.status,
                            courseDeleted: cou.deleted,
                            username: name
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
                          onClick={this.onRestoreAlert.bind(
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
                              collegeInit: college.name.initials,
                              username: name
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
            columnButton = null;
            // college deleted no buttons
            course = sortedCourse.map(cou =>
              cou.deleted === 0 ? (
                <tr key={cou._id}>
                  <td>{cou.name}</td>
                  <td>{cou.initials}</td>
                  <td>
                    {cou.status === 0 ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </td>
                  <td style={{ paddingLeft: "3%" }}>{cou.researchTotal}</td>
                  <td style={{ paddingLeft: "3%" }}>{cou.journalTotal}</td>
                </tr>
              ) : (
                ""
              )
            );
          }
          courseText = <h3 className="text-center text-danger">Courses Bin</h3>;
        } else {
          if (college.deleted === 0) {
            // college not deleted with buttons
            course = sortedCourse.map(cou =>
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
                  <td style={{ paddingLeft: "3%" }}>{cou.researchTotal}</td>
                  <td style={{ paddingLeft: "3%" }}>{cou.journalTotal}</td>
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
                            collegeName: college.name.fullName,
                            courseStatus: cou.status,
                            courseDeleted: cou.deleted,
                            username: name
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
                        // Active Button
                        <button
                          onClick={this.onDeleteAlert.bind(
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
                              collegeInit: college.name.initials,
                              username: name
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
                        // Disabled button
                        <button
                          className="btn btn-danger"
                          title="Delete Course"
                          disabled={true}
                        >
                          <i
                            className="fas fa-trash text-light"
                            style={{ fontSize: "12px" }}
                          />
                        </button>
                      )}
                      {cou.status === 0 ? (
                        // Active Button
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
                        // Disabled button
                        <button
                          className="btn btn-primary"
                          title="Add research to this course"
                          disabled={true}
                        >
                          <i
                            className="fas fa-plus text-light"
                            style={{ fontSize: "12px" }}
                          />
                        </button>
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
            course = sortedCourse.map(cou =>
              cou.deleted === 1 ? (
                <tr key={cou._id}>
                  <td>{cou.name}</td>
                  <td>{cou.initials}</td>
                  <td>
                    {cou.status === 0 ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </td>
                  <td style={{ paddingLeft: "3%" }}>{cou.researchTotal}</td>
                  <td style={{ paddingLeft: "3%" }}>{cou.journalTotal}</td>
                </tr>
              ) : (
                ""
              )
            );
          }
          courseText = <h3 className="text-center text-info">Courses</h3>;
        }
      } else {
        // Not logged in no buttons
        course = sortedCourse.map(cou =>
          cou.deleted === 0 ? (
            <tr key={cou._id}>
              <td>{cou.name}</td>
              <td>{cou.initials}</td>
              <td>
                {cou.status === 0 ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-danger">Inactive</span>
                )}
              </td>
              <td style={{ paddingLeft: "3%" }}>{cou.researchTotal}</td>
              <td style={{ paddingLeft: "3%" }}>{cou.journalTotal}</td>
            </tr>
          ) : (
            ""
          )
        );
      }

      // remove whitespace in course array
      courseFiltered = course.filter(function(el) {
        return el !== "";
      });
    } catch (error) {}

    if (courseFiltered.length === 0) {
      noCourses = "Nothing here";
    }

    return (
      <div style={{ overflowX: "auto", textAlign: "center" }}>
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
          onConfirm={this.onDeleteCourse}
          onCancel={this.onCancelDelete}
        >
          Delete Course?
        </SweetAlert>

        {/* CANCEL DELETE */}
        <SweetAlert
          show={this.state.deleteAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveDeleteCancel}
        >
          Course is not deleted
        </SweetAlert>

        {/* COURSE DELETE */}
        <SweetAlert
          show={this.state.deleteAlertOkay}
          success
          title="Deleted"
          onConfirm={this.onRemoveDeleteOkay}
        >
          Course deleted
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
          onConfirm={this.onRestoreCourse}
          onCancel={this.onCancelRestore}
        >
          Restore Course?
        </SweetAlert>

        {/* CANCEL RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveRestoreCancel}
        >
          Course is not restored
        </SweetAlert>

        {/* COLLEGE RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertOkay}
          success
          title="Restored"
          onConfirm={this.onRemoveRestoreOkay}
        >
          Course restored
        </SweetAlert>

        {/* CONTENT */}
        {courseText}
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
              {columnButton}
            </tr>
          </thead>
          <tbody>{courseFiltered}</tbody>
        </table>
        <h5>{noCourses}</h5>
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
