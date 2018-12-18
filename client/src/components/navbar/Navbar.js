import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

import './Navbar.css'
 
class Navbar extends Component {
    render() { 
        const {pageTitle} = this.props.pageTitle;
        return (
            <nav className="navbar navbar-size border-bottom">
                <div className="head-title">
                    <h3>{pageTitle}</h3>
                </div>
                <div className="navbar_items">
                    <Link to="/login"><i className="fa fa-key"></i> Login</Link>
                </div>  
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    pageTitle: state.pageTitle
});
 
export default connect(mapStateToProps)(Navbar);