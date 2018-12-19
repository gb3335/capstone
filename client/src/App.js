import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';


import { Provider } from 'react-redux';
import store from './store';

import './App.css';

import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Landing from './components/landing/Landing';

import Dashboard from './components/dashboard/Dashboard';
import OnlineCheck from './components/plagiarism/OnlineCheck';
import Login from './components/auth/login/Login';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Sidebar />
            <div className="navmain">
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
