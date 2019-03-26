import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotUser } from "../../../actions/authActions";
import TextFieldGroup from "../../common/TextFieldGroup";
import "./forgotpassword.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email

    };
    this.props.forgotUser(userData, this.props.history);
  }

  render() {
    const { errors } = this.state;
    return (

      <div className="container-fluid p-2">
        <Link to="/login" className="btn btn-light mb-3 float-left">
          <i className="fas fa-angle-left" /> Back to Accounts
         </Link>
        <div className="forgot-box">

          <div className="forgot-box-imgdiv">
            <img src="/images/bulsu_logo.png" className="mb-2" alt="BSU LOGO" />

          </div>
          <div className="row">
            <div className="col">
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="text"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  autoComplete={true}
                />
                <div className="optiondiv">
                  {/* <input className="form-control" placeholder="Password" type="password"/> */}

                  {/* <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" /> Remember Me
                                        </label>
                                    </div>*/}

                  <button type="submit" className="btn form-control">
                    Send new password
                  </button>
                  <div className="spacer" />

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  forgotUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { forgotUser }
)(Login);
