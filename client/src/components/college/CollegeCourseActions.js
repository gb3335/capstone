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

  onToggleCourseBin = e => {
    if (this.props.college.coursebin === false) {
      this.props.toggleCourseBin(1);
    } else {
      this.props.toggleCourseBin(0);
    }
  };

  render() {
    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <Link to="/add-course" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add Course
        </Link>
        <Link to="#" onClick={this.onToggleCourseBin} className="btn btn-light">
          <i className="fas fa-trash text-danger mr-1" /> Bin
        </Link>
      </div>
    );
  }
}
CollegeCourseActions.propTypes = {
  toggleCourseBin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  coursebin: state.college.coursebin
});

export default connect(
  mapStateToProps,
  { toggleCourseBin }
)(CollegeCourseActions);
