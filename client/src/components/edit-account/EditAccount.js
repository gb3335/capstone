import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { getColleges } from '../../actions/collegeActions';
import { editAccount, editPassword, editUsername } from '../../actions/registerActions';

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
      password1: '',
      password2: '',

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
      id: this.props.users.user._id
    };




    this.refs.resBtn0.setAttribute('disabled', 'disabled');
    this.props.editAccount(userData, this.props.history);
  };

  usernameSubmit = e => {
    e.preventDefault();

    const userData = {
      userName: this.state.userName,
      id: this.props.users.user._id
    };

    this.refs.resBtn1.setAttribute('disabled', 'disabled');
    this.props.editUsername(userData, this.props.history);
  };

  passwordSubmit = e => {
    e.preventDefault();

    const userData = {

      password: this.state.password,
      password1: this.state.password1,
      password2: this.state.password2,
      id: this.props.users.user._id
    };



    this.refs.resBtn.setAttribute('disabled', 'disabled');
    this.props.editPassword(userData, this.props.history);
  }


  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.refs.resBtn.removeAttribute('disabled');
    this.refs.resBtn0.removeAttribute('disabled');
    this.refs.resBtn1.removeAttribute('disabled');
  };

  render() {
    const { errors } = this.props;

    return (

      <div className="research">
        <div style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-12">
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <Link
                      to={/viewusers/ + this.props.auth.user.id}
                      className="btn btn-light mb-3 float-left"
                    >
                      <i className="fas fa-angle-left" /> Back to Accounts
                     </Link>
                  </div>
                  <div className="col-md-6" />

                </div>
                <div className="row" style={{ margin: "5px" }}>
                  <div className="col-md-3">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <div className="list-group" id="list-tab" role="tablist">

                      <a
                        className="list-group-item list-group-item-action active"
                        id="list-details-list"
                        data-toggle="list"
                        href="#list-details"
                        role="tab"
                        aria-controls="details"
                      >
                        <i className="fas fa-info-circle mr-2" />
                        User Information
            </a>
                      <a
                        className="list-group-item list-group-item-action"
                        id="list-abstract-list"
                        data-toggle="list"
                        href="#list-abstract"
                        role="tab"
                        aria-controls="abstract"
                      >
                        <i className="fas fa-user mr-2" />
                        Username
            </a>

                      <a
                        className="list-group-item list-group-item-action"
                        id="list-authors-list"
                        data-toggle="list"
                        href="#list-authors"
                        role="tab"
                        aria-controls="authors"
                      >
                        <i className="fas fa-key mr-2" />
                        Password
            </a>



                    </div>
                  </div>

                  <div className="col-md-8 ">
                    <br />
                    <div className="tab-content" id="nav-tabContent">
                      <h1 className="display-4 text-center">Update Account</h1>
                      <br />
                      <form onSubmit={this.onSubmit} className="tab-pane fade show active"
                        id="list-details"
                        role="tabpanel"
                        aria-labelledby="list-details-list">
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
                          placeholder="* Contact Number"
                          name="contact"
                          value={this.state.contact}
                          onChange={this.onChange}
                          error={errors.contact}
                          info="Type your contact number."
                        />

                        <input
                          ref="resBtn0"
                          type="submit"
                          value="Submit"
                          className="btn btn-info btn-block mt-4"
                        />
                      </form>
                      <form className="tab-pane fade"
                        id="list-abstract"
                        role="tabpanel"
                        aria-labelledby="list-abstract-list"
                        onSubmit={this.usernameSubmit}
                      >
                        <TextFieldGroup
                          placeholder="* Type your username"
                          name="userName"
                          value={this.state.userName}
                          onChange={this.onChange}
                          error={errors.userName}
                          info="Type your username."
                        />

                        <input
                          ref="resBtn1"
                          type="submit"
                          value="Submit"
                          className="btn btn-info btn-block mt-4"
                        />

                      </form >
                      <form
                        className="tab-pane fade"
                        id="list-authors"
                        role="tabpanel"
                        aria-labelledby="list-authors-list"
                        onSubmit={this.passwordSubmit}
                      >

                        <TextFieldGroup
                          placeholder="* Type your password"
                          name="password1"
                          value={this.state.password1}
                          onChange={this.onChange}
                          error={errors.password1}
                          info="Type your password."
                          type="password"
                        />
                        <TextFieldGroup
                          placeholder="* Re-type your password"
                          name="password2"
                          value={this.state.password2}
                          onChange={this.onChange}
                          error={errors.password2}
                          info="Re-type your password."
                          type="password"
                        />
                        <TextFieldGroup
                          placeholder="* Type your new password"
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
  editAccount: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  users: state.users,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getColleges, editAccount, editPassword, editUsername }
)(withRouter(EditAccount));
