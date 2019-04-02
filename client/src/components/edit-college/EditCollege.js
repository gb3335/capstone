import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

import { createCollege } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";

class CreateCollege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: this.props.college.college.name.fullName,
      initials: this.props.college.college.name.initials,
      logo: this.props.college.college.logo,
      librarian: this.props.college.college.librarian,
      selectedFile: "",
      background: this.props.college.college.color,
      researchTotal: this.props.college.college.researchTotal,
      journalTotal: this.props.college.college.journalTotal,
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
    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    const collegeData = {
      oldName: this.props.college.college.name.fullName,
      oldInitials: this.props.college.college.name.initials,
      fullName: this.state.fullName,
      initials: this.state.initials,
      logo: this.state.logo,
      ext: "",
      librarian: this.state.librarian,
      file: this.state.selectedFile,
      color: this.state.background,
      researchTotal: this.state.researchTotal,
      journalTotal: this.state.journalTotal,
      id: this.props.college.college._id,
      username: name
    };

    this.refs.colBtn.setAttribute("disabled", "disabled");
    this.props.createCollege(collegeData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.colBtn.removeAttribute("disabled");
  };

  handleChangeComplete = color => {
    this.setState({ background: color.hex });
  };

  render() {
    const { errors } = this.state;
    const path = "/colleges/" + this.props.college.college.name.initials;
    return (
      <div className="create-college">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={path} className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to College
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Edit College</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* College Name"
                  name="fullName"
                  value={this.state.fullName}
                  onChange={this.onChange}
                  error={errors.fullName}
                  info="College Name must be unique"
                />
                <TextFieldGroup
                  placeholder="* College Initials"
                  name="initials"
                  value={this.state.initials}
                  onChange={this.onChange}
                  error={errors.initials}
                  info="College Initials must also be unique"
                />
                <TextFieldGroup
                  placeholder="* Librarian"
                  name="librarian"
                  value={this.state.librarian}
                  onChange={this.onChange}
                  error={errors.librarian}
                  info="Who's the librarian for this college"
                />

                <SketchPicker
                  color={this.state.background}
                  onChangeComplete={this.handleChangeComplete}
                />
                <small className="form-text text-muted">Color</small>

                <input
                  ref="colBtn"
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

CreateCollege.propTypes = {
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createCollege }
)(withRouter(CreateCollege));
