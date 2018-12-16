import React, { Component } from 'react';
import './App.css';

import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

import Main from './components/main/Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Sidebar />
        <div className="navmain">
          <Navbar />
          <Main />
        </div>
        
      </div>
    );
  }
}

export default App;
