import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ToggleButton.css'
 
class ToggleButton extends Component {
    render() { 
        return (
            
            <Link to="#" className="toggle_button">
                <i className="fa fa-grip-vertical"></i>
            </Link>
            
        );
    }
}
 
export default ToggleButton;