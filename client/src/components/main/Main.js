import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Landing from "../landing/Landing";

import Dashboard from "../dashboard/Dashboard";
import OnlineCheck from "../plagiarism/OnlineCheck";
import LocalCheck from "../plagiarism/LocalCheck";
import Login from "../auth/login/Login";
import Forgot from "../auth/forgotpassword/forgotpassword";
import Sidebar from "../sidebar/Sidebar";
import NotFound from "../not-found/NotFound";

// Dashboard
import DetailedActivities from "../dashboard/DetailedActivities";

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
import Journals from "../journals/Journals";
import Journal from "../journal/Journal";
import AddJournal from "../add-journal/AddJournal";
import EditJournal from "../edit-journal/EditJournal";
import AddJournalAuthor from "../add-credentials/AddJournalAuthor";

//register and user
import Register from "../register/Register";
import ViewUsers from "../users/ViewUsers";
import ViewUser from "../user/ViewUser";
import EditAccount from "../edit-account/EditAccount";
import EditPassword from "../edit-account/EditPassword";
import MyAccount from "../user/MyAccount";
import UserLogs from "../users/UserLogs";

// Backup & Restore
import BackupList from "../user/BackupList";

// Plagiarism Results
import LocalResult from "../plagiarism-result/LocalResult";
import LocalResultSideBySide from "../plagiarism-result/LocalResultSideBySide";
import JournalLocalResult from "../plagiarism-result/JournalLocalResult";
import JournalLocalResultSideBySide from "../plagiarism-result/JournalLocalResultSideBySide";

// Grammar Check
import Grammar from "../grammar-check/Grammar";

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
    const { user } = this.props.auth;
    let addCollege;
    let backupList;

    try {
      if (user.userType !== "LIBRARIAN") {
        addCollege = (
          <Switch>
            <PrivateRoute exact path="/add-college" component={AddCollege} />
          </Switch>
        );
        backupList = (
          <Switch>
            <PrivateRoute exact path="/backup-list" component={BackupList} />
          </Switch>
        );
      } else {
        addCollege = <Route exact path="/add-college" component={NotFound} />;

        backupList = <Route exact path="/backup-list" component={NotFound} />;
      }
    } catch (error) {}

    return (
      <Router>
        <div className="App">
          <Sidebar />
          <div className={this.state.sideclass}>
            <Navbar />
            <div className="main" style={{ backgroundColor: "white" }}>
              <div id="page-container">
                <div id="content-wrap">
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/forgotpassword" component={Forgot} />
                  <Route exact path="/colleges" component={Colleges} />
                  <Route exact path="/colleges/:initials" component={College} />
                  <Route exact path="/researches" component={Researches} />
                  <Route exact path="/researches/:id" component={Research} />
                  <Route exact path="/journals" component={Journals} />
                  <Route exact path="/journals/:id" component={Journal} />
                  <Route exact path="/localcheck" component={LocalCheck} />
                  <Route exact path="/not-found" component={NotFound} />
                  <Route
                    exact
                    path="/localresult/abstract"
                    component={LocalResult}
                  />
                  <Route
                    exact
                    path="/localResultSideBySide/abstract"
                    component={LocalResultSideBySide}
                  />
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/add-course"
                      component={AddCourse}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/onlinecheck"
                      component={OnlineCheck}
                    />
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
                      path="/viewusers"
                      component={ViewUsers}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/viewusers/:id"
                      component={ViewUser}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute exact path="/userlogs" component={UserLogs} />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/myaccount/:id/:oldpath/:oldid"
                      component={MyAccount}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute exact path="/register" component={Register} />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/edit-account/:oldpath/:oldid"
                      component={EditAccount}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/edit-password"
                      component={EditPassword}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/add-author"
                      component={AddAuthor}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/add-journal-author"
                      component={AddJournalAuthor}
                    />
                  </Switch>
                  {addCollege}
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
                      path="/activities"
                      component={DetailedActivities}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/localresult/research"
                      component={LocalResult}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/localresult/journal"
                      component={JournalLocalResult}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/localResultSideBySide/research"
                      component={LocalResultSideBySide}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/localResultSideBySide/journal"
                      component={JournalLocalResultSideBySide}
                    />
                  </Switch>
                  <Switch>
                    <PrivateRoute exact path="/grammar" component={Grammar} />
                  </Switch>
                  {backupList}
                </div>
              </div>
            </div>
            <footer id="footer">
              <p>
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/logo.png"
                  alt="website-logo"
                  style={{ width: "25px" }}
                />{" "}
                Copyright © {new Date().getFullYear()}. BulSU Plagiarism and
                Grammar Checker
              </p>
            </footer>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  sidebar: state.sidebar,
  auth: state.auth
});

export default connect(mapStateToProps)(Main);
