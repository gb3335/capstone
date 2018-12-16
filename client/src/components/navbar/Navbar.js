import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Navbar.css'
 
class Navbar extends Component {
    render() { 
        const {pageTitle} = this.props.pageTitle;
        return (
            <nav className="navbar navbar-size border-bottom">
                <div className="head-title">
                    <h3>{pageTitle}</h3>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    pageTitle: state.pageTitle
});
 
export default connect(mapStateToProps)(Navbar);