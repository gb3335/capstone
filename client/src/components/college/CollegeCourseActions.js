import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { toggleCourseBin } from "../../actions/collegeActions";

class CollegeCourseActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursebin: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ coursebin: nextProps.coursebin });
  }

  onToggleCourseBin = e => {
    if (this.props.college.coursebin === false) {
      this.props.toggleCourseBin(1);
    } else {
      this.props.toggleCourseBin(0);
    }
  };

  render() {
    let courseBinAction;
    let courseBinActionForAuth;
    let addCourse;

    if (this.state.coursebin) {
      courseBinAction = (
        <Link to="#" onClick={this.onToggleCourseBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> Courses
        </Link>
      );
    } else {
      courseBinAction = (
        <Link to="#" onClick={this.onToggleCourseBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </Link>
      );
    }

    if (this.props.auth.isAuthenticated) {
      courseBinActionForAuth = courseBinAction;
      addCourse = (
        <Link to="/add-course" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add Course
        </Link>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        {addCourse}
        {courseBinActionForAuth}
      </div>
    );
  }
}
CollegeCourseActions.propTypes = {
  toggleCourseBin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  coursebin: state.college.coursebin,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { toggleCourseBin }
)(CollegeCourseActions);
