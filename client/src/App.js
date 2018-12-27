import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from './actions/authActions';
import { Provider, connect } from 'react-redux';
import store from './store';

import './App.css';

import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Landing from './components/landing/Landing';

import Dashboard from './components/dashboard/Dashboard';
import OnlineCheck from './components/plagiarism/OnlineCheck';
import Login from './components/auth/login/Login';

//Check for Token
if(localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {

  constructor(){
    super()
    this.state = {
      sideclass: "navmain"
    }
  }

  componentWillUpdate(nextProps, nextState){
    console.log("prevState")
  }

  componentWillReceiveProps(){
    const curstate = store.getState();
    const {hide} = curstate.sidebar;
    if(hide){
      const sideclass = "sidebarhidden"
      this.setState({sideclass})
    }else{
      const sideclass = "navmain"
      this.setState({sideclass})
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Sidebar />
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
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
