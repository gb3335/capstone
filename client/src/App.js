import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from './actions/authActions';
import { Provider} from 'react-redux';
import store from './store';

import './App.css';

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

  constructor(){
    super()
    this.state = {
      sideclass: "navmain"
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
