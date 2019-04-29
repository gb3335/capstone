import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { getColleges } from "../../actions/collegeActions";
import { createAccount } from "../../actions/registerActions";

import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

class Register extends Component {
  constructor(props) {
    super(props);
    this.escFunction = this.escFunction.bind(this);
    this.state = {
      firstName: "",
      email: "",
      lastName: "",
      middleName: "",
      contact: "+63 ",
      userType: "LIBRARIAN",

      errors: {}
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();
    let myContact = this.state.contact.replace(/\s/g, '')
    let contactCopy = "0" + myContact.substr(3, myContact.length)
    const userData = {
      email: this.state.email,
      firstname: this.state.firstName,
      lastname: this.state.lastName,
      middlename: this.state.middleName,
      contact: contactCopy,
      usertype: this.state.userType,
      createdBy: this.props.auth.user.id
    };

    this.refs.resBtn.setAttribute("disabled", "disabled");
    this.props.createAccount(userData, this.props.history);
  };

  onChange = e => {

    if (e.target.name !== "contact") {
      this.setState({ [e.target.name]: e.target.value });
      this.refs.resBtn.removeAttribute("disabled");
    }
  };

  contactChange = (e) => {

    if (this.state.contact.length < 4) {
      this.setState({ [e.target.name]: "+63 " });
      this.refs.resBtn.removeAttribute("disabled");
    }
    else {
      if (this.state.contact.length === 6) {
        this.setState({ [e.target.name]: e.target.value + " " });
        this.refs.resBtn.removeAttribute("disabled");
      }
      else if (this.state.contact.length === 10) {
        this.setState({ [e.target.name]: e.target.value + " " });
        this.refs.resBtn.removeAttribute("disabled");
      }
      else {
        this.setState({ [e.target.name]: e.target.value });
        this.refs.resBtn.removeAttribute("disabled");
      }
    }
  }
  escFunction(event) {

    if (event.srcElement.name === "contact") {
      if (this.state.contact.length < 4) {
        this.setState({ contact: "+63 " });
        this.refs.resBtn.removeAttribute("disabled");
      }
      if (event.keyCode === 8) {
        let msg = this.state.contact.substr(0, this.state.contact.length - 1)
        this.setState({ contact: msg });
        this.refs.resBtn.removeAttribute("disabled");
      }
    }
  }
  onActive = () => {
    this.props.onActive(this.escFunction.bind(this));
  }


  render() {
    const { college, errors } = this.props;
    let collegeOptions = [{ label: "* Select College", value: "" }];
    let typeOptions = [
      { label: "ADMINISTRATOR", value: "ADMINISTRATOR" },
      { label: "LIBRARIAN", value: "LIBRARIAN" }
    ];

    if (this.state.userType === "ADMINISTRATOR") {
      return (
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <Link to="/viewusers" className="btn btn-light mb-3 float-left">
                  <i className="fas fa-angle-left" /> Back to Users
                </Link>
                <br />
                <br />
                <br />
                <h1 className="display-4 text-center">Add Account</h1>
                <p className="lead text-center">Create your account</p>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                    info="Type your email."
                  />
                  <SelectListGroup
                    placeholder="type"
                    name="userType"
                    onChange={this.onChange}
                    value={this.state.userType}
                    error={errors.usertype}
                    options={typeOptions}
                    info="Select your account type."
                  />
                  <TextFieldGroup
                    placeholder="* First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChange}
                    error={errors.firstname}
                    info="Type your first name."
                  />

                  <TextFieldGroup
                    placeholder="* Middle Name"
                    name="middleName"
                    value={this.state.middleName}
                    onChange={this.onChange}
                    error={errors.middlename}
                    info="Type your middle name."
                  />
                  <TextFieldGroup
                    placeholder="* Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                    error={errors.lastname}
                    info="Type your last name."
                  />
                  <TextFieldGroup
                    id="contact"
                    placeholder="* Contact Number"
                    name="contact"
                    value={this.state.contact}
                    onChange={this.contactChange}
                    error={errors.contact}
                    onKeyDown={this.onActive.bind(this)}
                    info="Type your contact number. +63 XXX XXX XXXX"
                  />

                  <input
                    ref="resBtn"
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
    } else if (this.state.userType === "LIBRARIAN") {
      return (
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <Link to="/viewusers" className="btn btn-light mb-3 float-left">
                  <i className="fas fa-angle-left" /> Back to Users
                </Link>
                <br />
                <br />
                <br />
                <h1 className="display-4 text-center">Add Account</h1>
                <p className="lead text-center">Create your account</p>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                    info="Type your email."
                  />
                  <SelectListGroup
                    placeholder="type"
                    name="userType"
                    onChange={this.onChange}
                    value={this.state.userType}
                    error={errors.usertype}
                    options={typeOptions}
                    info="Select your account type."
                  />
                  <TextFieldGroup
                    placeholder="* First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChange}
                    error={errors.firstname}
                    info="Type your first name."
                  />
                  <TextFieldGroup
                    placeholder="* Middle Name"
                    name="middleName"
                    value={this.state.middleName}
                    onChange={this.onChange}
                    error={errors.middlename}
                    info="Type your middle name."
                  />
                  <TextFieldGroup
                    placeholder="* Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                    error={errors.lastname}
                    info="Type your last name."
                  />

                  <TextFieldGroup
                    id="contact"
                    placeholder="* Contact Number"
                    name="contact"
                    value={this.state.contact}
                    onChange={this.contactChange}
                    error={errors.contact}
                    onKeyDown={this.onActive.bind(this)}
                    info="Type your contact number. +63 XXX XXX XXXX"
                  />

                  <input
                    ref="resBtn"
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
}
Register.propTypes = {
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getColleges, createAccount }
)(withRouter(Register));
