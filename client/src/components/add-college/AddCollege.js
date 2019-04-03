import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

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
      background: "#000000",
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

    const name = this.props.auth.user.id;

    const collegeData = {
      fullName: this.state.fullName,
      initials: this.state.initials,
      logo:
        logoname
          .split(".")
          .slice(0, -1)
          .join(".") + Date.now(),
      librarian: this.state.librarian,
      file: this.state.selectedFile,
      color: this.state.background,
      username: name
    };

    this.refs.colBtn.setAttribute("disabled", "disabled");
    this.props.createCollege(collegeData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.colBtn.removeAttribute("disabled");
  };

  onFileSelected = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.colBtn.removeAttribute("disabled");

    try {
      let files = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = e => {
        this.setState({
          selectedFile: e.target.result
        });
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  handleChangeComplete = color => {
    this.setState({ background: color.hex });
  };

  render() {
    const { errors } = this.props;

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
              <h1 className="display-4 text-center">Add College</h1>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <SketchPicker
                        color={this.state.background}
                        onChangeComplete={this.handleChangeComplete}
                      />
                      <small className="form-text text-muted">Color</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      to="#"
                      htmlFor="collegeLogo"
                      className="btn btn-light"
                    >
                      <i className="fas fa-plus text-info mr-1" />
                      Add Image
                    </label>
                    <ImageFieldGroup
                      placeholder="* Logo"
                      name="logo"
                      value={this.state.logo}
                      onChange={this.onFileSelected}
                      error={errors.logo}
                      info={this.state.logo.replace(/^.*\\/, "")}
                      id="collegeLogo"
                    />
                  </div>
                </div>
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
  createCollege: PropTypes.func.isRequired,
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
