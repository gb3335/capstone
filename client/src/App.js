import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import './App.css';

import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';

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
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Sidebar />
            <Main />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
