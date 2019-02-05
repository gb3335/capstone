import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Landing from "../landing/Landing";

import Dashboard from "../dashboard/Dashboard";
import OnlineCheck from "../plagiarism/OnlineCheck";
import Login from "../auth/login/Login";
import Sidebar from "../sidebar/Sidebar";
import NotFound from "../not-found/NotFound";

// Colleges Import
import Colleges from "../colleges/Colleges";
import College from "../college/College";
import AddCourse from "../add-credentials/AddCourse";
import CreateCollege from "../create-college/CreateCollege";
import EditCollege from "../edit-college/EditCollege";

// Researches Import
import Researches from "../researches/Researches";
import Research from "../research/Research";

import PrivateRoute from "../common/PrivateRoute";

import "./Main.css";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      hide: false,
      sideclass: "navmain"
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebar.hide) {
      const sideclass = "sidebarhidden";
      this.setState({ sideclass });
    } else {
      const sideclass = "navmain";
      this.setState({ sideclass });
    }
  }

  componentDidMount() {
    if (this.props.sidebar.hide) {
      const sideclass = "sidebarhidden";
      this.setState({ sideclass });
    } else {
      const sideclass = "navmain";
      this.setState({ sideclass });
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Sidebar />
          <div className={this.state.sideclass}>
            <Navbar />
            <div className="main" style={{ backgroundColor: "white" }}>
              <Route exact path="/" component={Landing} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/onlinecheck" component={OnlineCheck} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/colleges" component={Colleges} />
              <Route exact path="/colleges/:initials" component={College} />
              <Route exact path="/researches" component={Researches} />
              <Route exact path="/researches/:id" component={Research} />
              <Route exact path="/not-found" component={NotFound} />
              <Switch>
                <PrivateRoute exact path="/add-course" component={AddCourse} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-college"
                  component={CreateCollege}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-college"
                  component={EditCollege}
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  sidebar: state.sidebar
});

export default connect(mapStateToProps)(Main);
