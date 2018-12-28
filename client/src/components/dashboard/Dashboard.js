import React, { Component } from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {changePageTitle} from '../../actions/sidebarActions';
import './Dashboard.css'
 
class Dashboard extends Component {

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

Dashboard.propTypes = {
    changePageTitle: PropTypes.func.isRequired
}
 
export default connect(null, {changePageTitle})(Dashboard);