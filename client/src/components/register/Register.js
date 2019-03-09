import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { getColleges } from '../../actions/collegeActions';
import { createAccount } from '../../actions/registerActions';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {

      firstName: '',
      email: '',
      lastName: '',
      middleName: '',
      contact: '',
      userType: 'ADMINISTRATOR',
      college: '',
      errors: {}
    };
  }
  componentWillMount() {
    this.props.getColleges();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      firstname: this.state.firstName,
      lastname: this.state.lastName,
      middlename: this.state.middleName,
      contact: this.state.contact,
      college: this.state.college,
      usertype: this.state.userType
    };

    this.refs.resBtn.setAttribute('disabled', 'disabled');
    this.props.createAccount(userData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute('disabled');
  };

  render() {
    const { college, errors } = this.props;
    let collegeOptions = [{ label: '* Select College', value: '' }];
    let typeOptions = [

      { label: 'ADMINISTRATOR', value: 'ADMINISTRATOR' },
      { label: 'LIBRARIAN', value: 'LIBRARIAN' }
    ];
    try {
      college.colleges.map(college =>
        collegeOptions.push({
          label: college.name.fullName,
          value: college.name.fullName
        })
      );
    } catch (error) { }

    if (this.state.userType === 'ADMINISTRATOR') {
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
                    placeholder="* Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                    error={errors.lastname}
                    info="Type ypur last name."
                  />
                  <TextFieldGroup
                    placeholder="* Middle Name"
                    name="middleName"
                    value={this.state.middleName}
                    onChange={this.onChange}
                    error={errors.middlename}
                    info="Type your middle name."
                  />{' '}
                  <TextFieldGroup
                    placeholder="* Contact Number"
                    name="contact"
                    value={this.state.contact}
                    onChange={this.onChange}
                    error={errors.contact}
                    info="Type your contact number."
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
    else if (this.state.userType === 'LIBRARIAN') {
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

                  <div className="form-group">
                    <SelectListGroup
                      placeholder="College"
                      name="college"
                      value={this.state.college}
                      onChange={this.onChange}
                      options={collegeOptions}
                      error={errors.college}
                      info="Select your college"
                    />
                  </div>

                  <TextFieldGroup
                    placeholder="* First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChange}
                    error={errors.firstname}
                    info="Type your first name."
                  />
                  <TextFieldGroup
                    placeholder="* Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                    error={errors.lastname}
                    info="Type ypur last name."
                  />
                  <TextFieldGroup
                    placeholder="* Middle Name"
                    name="middleName"
                    value={this.state.middleName}
                    onChange={this.onChange}
                    error={errors.middlename}
                    info="Type your middle name."
                  />{' '}
                  <TextFieldGroup
                    placeholder="* Contact Number"
                    name="contact"
                    value={this.state.contact}
                    onChange={this.onChange}
                    error={errors.contact}
                    info="Type your contact number."
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
  createAccount: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { getColleges, createAccount }
)(withRouter(Register));
