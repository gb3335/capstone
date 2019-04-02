import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../../actions/authActions";
import TextFieldGroup from "../../common/TextFieldGroup";
import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
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
      username: this.state.username,
      password: this.state.password
    };
    this.props.loginUser(userData);
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="container-fluid p-2">
        <div className="login-box">
          <div className="login-box-imgdiv">
            <img src="/images/bulsu_logo.png" alt="BSU LOGO" />
          </div>
          <div className="row">
            <div className="col">
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email or Username"
                  name="username"
                  type="text"
                  value={this.state.username}
                  onChange={this.onChange}
                  error={errors.username}
                  autoComplete={true}
                />
                {/* <input className="form-control" placeholder="Email or Username" type="text"/> */}
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <div className="optiondiv">
                  {/* <input className="form-control" placeholder="Password" type="password"/> */}

                  {/* <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" /> Remember Me
                                        </label>
                                    </div>*/}

                  <button type="submit" className="btn form-control">
                    Sign In
                  </button>
                  <div className="spacer" />
                  <Link to="/forgotpassword">Forgot Password?</Link>
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
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
