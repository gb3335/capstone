import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteCourse } from "../../actions/collegeActions";

class Courses extends Component {
  onDeleteClick = (college, id) => {
    this.props.deleteCourse(college, id);
  };

  render() {
    const { college } = this.props.college;

    const course = this.props.course.map(cou => (
      <tr key={cou._id}>
        <td>{cou.name}</td>
        <td>{cou.initials}</td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, college._id, cou._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Initials</th>
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
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college
});

export default connect(
  mapStateToProps,
  { deleteCourse }
)(Courses);
