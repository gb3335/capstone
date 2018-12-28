import React, { Component } from 'react';
<<<<<<< HEAD
import {changePageTitle} from '../../actions/sidebarActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './Dashboard.css'
 
class Main extends Component {
=======
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {changePageTitle} from '../../actions/sidebarActions';
import './Dashboard.css'
 
class Dashboard extends Component {
>>>>>>> main

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

<<<<<<< HEAD
Main.propTypes = {
    changePageTitle: PropTypes.func.isRequired,
}
 
export default connect(null,{changePageTitle})(Main);
=======
Dashboard.propTypes = {
    changePageTitle: PropTypes.func.isRequired
}
 
export default connect(null, {changePageTitle})(Dashboard);
>>>>>>> main
