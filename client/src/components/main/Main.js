import React, { Component } from 'react';
import { BrowserRouter as Route} from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import Landing from '../landing/Landing';

import Dashboard from '../dashboard/Dashboard';
import OnlineCheck from '../plagiarism/OnlineCheck';
import Login from '../auth/login/Login';

import './Main.css'
 
class Main extends Component {

    constructor() {
        super()
        this.state = {
           hide: false,
           sideclass: "navmain",
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.sidebar.hide){
            const sideclass = "sidebarhidden"
            this.setState({sideclass})
        }else{
            const sideclass = "navmain"
            this.setState({sideclass})
        }
    }


    render() { 
        return (
            <div className={this.state.sideclass}>
                <Navbar />
                <div className="main">
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/onlinecheck" component={OnlineCheck} />
                    <Route exact path="/login" component={Login} />
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    sidebar: state.sidebar
})
 
export default connect(mapStateToProps)(Main);