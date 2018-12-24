import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../../actions/authActions';
import TextFieldGroup from '../../common/TextFieldGroup'
import './Login.css'
 
class Login extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();

        const userData = {
            username: this.state.username,
            password: this.state.password
        }
        this.props.loginUser(userData);
    }

    render() { 
        const { errors } = this.state;
        return (
            <div className="container-fluid p-2">
                <div className="login-box">
                <h4>Login</h4>
                    <div className="row">
                        <div className="col">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <TextFieldGroup
                                        placeholder="Email or Username"
                                        name="username"
                                        type="text"
                                        value={this.state.username}
                                        onChange={this.onChange}
                                        error={errors.username}
                                    />
                                    {/* <input className="form-control" placeholder="Email or Username" type="text"/> */}
                                </div>
                                <div className="form-group">
                                    <TextFieldGroup
                                        placeholder="Password"
                                        name="password"
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                        error={errors.password}
                                    />
                                    {/* <input className="form-control" placeholder="Password" type="password"/> */}
                                </div>
                                <div className="optiondiv">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" /> Remember Me
                                        </label>
                                    </div>
                                    <div className="spacer"/>
                                    <div className="col-xs-4">
                                        <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
                                    </div>
                                </div>
                            </form>
                            <div className="forgotdiv">
                            <div className="spacer"/>
                                <Link to="/login">Forgot Password?</Link>
                            </div>
                            
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
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(Login);