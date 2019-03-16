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
import EditCourse from "../edit-credentials/EditCourse";
import AddCollege from "../add-college/AddCollege";
import EditCollege from "../edit-college/EditCollege";

// Researches Import
import Researches from "../researches/Researches";
import Research from "../research/Research";
import AddResearch from "../add-research/AddResearch";
import AddAuthor from "../add-credentials/AddAuthor";
import EditResearch from "../edit-research/EditResearch";

//Journal Import
import Journals from "../journals/Researches";
import Journal from "../journal/Research";
import AddJournal from "../add-journal/AddResearch";
import EditJournal from "../edit-journal/EditResearch";


//register and user
import Register from "../register/Register";
import ViewUsers from "../users/ViewUsers";
import ViewUser from "../view-user/ViewUser";
import EditAccount from "../edit-account/EditAccount";

// Plagiarism Results
import LocalResult from "../plagiarism-result/LocalResult";
import LocalResult_id from "../plagiarism-result/LocalResult_id";

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
              <Route exact path="/journals" component={Journals} />
              <Route exact path="/journals/:id" component={Journal} />

              <Route exact path="/not-found" component={NotFound} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/viewusers" component={ViewUsers} />
              <Route exact path="/viewusers/:id" component={ViewUser} />

              <Switch>
                <PrivateRoute exact path="/add-course" component={AddCourse} />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-course"
                  component={EditCourse}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-account"
                  component={EditAccount}
                />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-author" component={AddAuthor} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-college"
                  component={AddCollege}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-college"
                  component={EditCollege}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-research"
                  component={AddResearch}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-journal"
                  component={AddJournal}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-research"
                  component={EditResearch}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-journal"
                  component={EditJournal}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/localResult"
                  component={LocalResult}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/localResult/:id"
                  component={LocalResult_id}
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
