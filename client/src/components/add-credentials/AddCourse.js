import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addCourse } from "../../actions/collegeActions";

class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      initials: "",

      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const courseData = {
      name: this.state.name,
      initials: this.state.initials,
      colId: this.props.college.college._id,
      college: this.props.college
    };

    this.refs.courseBtn.setAttribute("disabled", "disabled");
    this.props.addCourse(courseData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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
                Add Course to {this.props.college.college.name.initials}
              </h1>
              <p className="lead text-center">Add course to this college</p>
              <small className="d-block pb-3">* = required fields</small>
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

AddCourse.propTypes = {
  errors: PropTypes.object.isRequired,
  addCourse: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  college: state.college
});

export default connect(
  mapStateToProps,
  { addCourse }
)(withRouter(AddCourse));
