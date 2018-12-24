import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

import './Navbar.css'
import ToggleButton from '../sidebar/ToggleButton'

class Navbar extends Component {
    render() { 
        const {isAuthenticated, user} = this.props.auth
       
        const {pageTitle} = this.props.pageTitle;

        const guestLinks = (
            <ul className="mainUL">
                <li className="mainLI">    
                    <Link to="/login" className="normalA"><i className="fa fa-key"></i> Login</Link>
                </li>
            </ul>
        );
        
        const authLinks = (
            <ul className="mainUL">
                <li className="mainLI">
                    <a className="collapsed account_button" id="account" data-toggle="collapse" href="#userMenu" aria-expanded="false"> 
                        <img className="user_img" src={user.avatar} alt=""></img>
                        <p>{user.firstName}</p>
                    </a>
                    <div id="userMenu"className="collapse" aria-expanded="false">
                        <ul className="account_submenus">
                            <li><a href="#">Account Setting</a></li>
                            <li>qwer</li>
                            <li>qwer</li>
                            <li>qwer</li>
                        </ul>
                    </div>
                </li>
            </ul>
        );


        return (
            <nav className="navbar navbar-size">
                <div><ToggleButton/></div>
                <div className="head-title d-none d-lg-block">
                    <Link to="/">{pageTitle}</Link>
                </div>
                <div className="spacer"/>
                <div className="navbar_items" id="pangcol" aria-expanded="true">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>  
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    pageTitle: state.pageTitle,
    auth: state.auth
});
 
export default connect(mapStateToProps)(Navbar);