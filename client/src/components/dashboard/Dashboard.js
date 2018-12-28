import React, { Component } from 'react';
import {changePageTitle} from '../../actions/sidebarActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './Dashboard.css'
 
class Main extends Component {

    componentDidMount(){
        this.props.changePageTitle("Dashboard")
    }

    render() { 
        return (
            <div className="container-fluid p-2">
                <p>Dashboard content goes here..</p>
            </div>
        );
    }
}

Main.propTypes = {
    changePageTitle: PropTypes.func.isRequired,
}
 
export default connect(null,{changePageTitle})(Main);