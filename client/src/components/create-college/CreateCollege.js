import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { createCollege } from "../../actions/collegeActions";

import TextFieldGroup from "../common/TextFieldGroup";
import ImageFieldGroup from "../common/ImageFieldGroup";

class CreateCollege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      initials: "",
      logo: "",
      librarian: "",
      selectedFile: "",
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
    const logo = this.state.logo;
    const logoname = logo.replace(/^.*\\/, "");

    const collegeData = {
      fullName: this.state.fullName,
      initials: this.state.initials,
      logo:
        logoname
          .split(".")
          .slice(0, -1)
          .join(".") + Date.now(),
      ext: logoname.split(".").pop(),
      librarian: this.state.librarian,
      file: this.state.selectedFile
    };

    this.props.createCollege(collegeData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onFileSelected = e => {
    this.setState({ [e.target.name]: e.target.value });

    let files = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = e => {
      this.setState({
        selectedFile: e.target.result
      });
    };
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="create-college">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/colleges" className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Colleges
              </Link>
              <br />
              <br />
              <br />
              <h1 className="display-4 text-center">Create College</h1>
              <p className="lead text-center">
                Let's get some information for your college
              </p>
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
                <ImageFieldGroup
                  placeholder="* Logo"
                  name="logo"
                  value={this.state.logo}
                  onChange={this.onFileSelected}
                  error={errors.logo}
                  info="College Logo"
                />
                <input
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
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createCollege }
)(withRouter(CreateCollege));
