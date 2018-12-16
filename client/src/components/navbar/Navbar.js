import React, { Component } from 'react';

import './Navbar.css'
 
class Navbar extends Component {
    render() { 
        return (
            <nav className="navbar navbar-size border-bottom">
                <div className="head-title">
                    <h3>Dashboard</h3>
                </div>
            </nav>
        );
    }
}
 
export default Navbar;