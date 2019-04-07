import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { editCourse } from "../../actions/collegeActions";

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initials: "",
      totalRes: "",
      totalJour: "",
      deleted: "",
      collegeId: "",
      courseId: "",
      deactivate: false,
      errors: {}
    };
  }

  componentDidMount() {
    const { course } = this.props.location;

    try {
      this.setState({ name: course.courseName });
      this.setState({ initials: course.courseInitials });
      this.setState({ courseId: course.courseId });
      this.setState({ collegeId: course.collegeId });
      this.setState({ totalRes: course.courseTotalRes });
      this.setState({ totalJour: course.courseTotalJour });
      this.setState({ deleted: course.courseDeleted });
      {
        course.courseStatus === 0
          ? this.setState({ deactivate: false })
          : this.setState({ deactivate: true });
      }
    } catch (error) {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const name = this.props.auth.user.id;

    const courseData = {
      name: this.state.name,
      initials: this.state.initials,
      researchTotal: this.state.totalRes,
      journalTotal: this.state.totalJour,
      deleted: this.state.deleted,
      colId: this.state.collegeId,
      courseId: this.state.courseId,
      deactivate: this.state.deactivate,
      colInit: this.props.college.college.name.initials,
      username: name
    };

    this.refs.courseBtn.setAttribute("disabled", "disabled");
    this.props.editCourse(courseData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.courseBtn.removeAttribute("disabled");
  };

  onChangeStat = e => {
    this.setState({
      deactivate: this.state.deactivate === false ? true : false
    });
    this.refs.courseBtn.removeAttribute("disabled");
  };

  render() {
    const { errors } = this.state;

    const path = "/colleges/" + this.props.college.college.name.initials;
    return (
      <div className="add-course">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={path} className="btn btn-light">
                <i className="fas fa-angle-left" /> Go Back
              </Link>
              <h1 className="display-4 text-center">
                Edit Course of {this.props.college.college.name.initials}
              </h1>
              <p className="lead text-center">Edit course of this college</p>
              <small className="d-block pb-3">* required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Course Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="* Course Initials"
                  name="initials"
                  value={this.state.initials}
                  onChange={this.onChange}
                  error={errors.initials}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="deactivate"
                    id="deactivate"
                    checked={this.state.deactivate === true}
                    value={this.state.deactivate}
                    onChange={this.onChangeStat}
                  />
                  <label className="form-check-label" htmlFor="deactivate">
                    Deactivate
                  </label>
                </div>
                <input
                  ref="courseBtn"
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditCourse.propTypes = {
  errors: PropTypes.object.isRequired,
  editCourse: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  college: state.college,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { editCourse }
)(withRouter(EditCourse));
