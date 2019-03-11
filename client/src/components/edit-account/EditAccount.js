import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { getColleges } from '../../actions/collegeActions';
import { editAccount } from '../../actions/registerActions';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {

      firstName: this.props.users.user.name.firstName,
      email: this.props.users.user.email,
      lastName: this.props.users.user.name.lastName,
      middleName: this.props.users.user.name.middleName,
      contact: this.props.users.user.contact,
      userType: this.props.users.user.userType,
      college: this.props.users.user.college,
      password: '',
      userName: this.props.users.user.userName,
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

      userName: this.state.userName,
      password: this.state.password,
      id: this.props.users.user._id
    };

    this.refs.resBtn.setAttribute('disabled', 'disabled');
    this.props.editAccount(userData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute('disabled');
  };

  render() {
    const { errors } = this.props;

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
              <h1 className="display-4 text-center">Update Account</h1>
              <p className="lead text-center">Edit your account</p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="Type your email."
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
                <TextFieldGroup
                  placeholder="* Type your username"
                  name="userName"
                  value={this.state.userName}
                  onChange={this.onChange}
                  error={errors.userName}
                  info="Type your username."
                />
                <TextFieldGroup
                  placeholder="* Type your password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                  info="Type your new password."
                  type="password"
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
EditAccount.propTypes = {
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  createAccount: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  users: state.users
});
export default connect(
  mapStateToProps,
  { getColleges, editAccount }
)(withRouter(EditAccount));
