import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/authActions";
import { changePageTitle } from "../../actions/sidebarActions";
import { hideSideBar } from "../../actions/sidebarActions";

import "./Navbar.css";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  onClickHideSidebar = () => {
    const { hide } = this.props.sidebar;
    this.props.hideSideBar(hide);
  };

  changeTitle = title => {
    this.props.changePageTitle(title);
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    // const { pageTitle } = this.props.sidebar;

    const guestLinks = (
      <ul className="mainUL">
        <li className="mainLI">
          <Link
            to="/login"
            onClick={() => this.changeTitle("Login")}
            className="normalA"
          >
            <i className="fa fa-key" /> Login
          </Link>
        </li>
      </ul>
    );

    const authLinks = (
      <ul className="mainUL">
        <li className="mainLI">
          <a
            className="collapsed account_button"
            id="account"
            data-toggle="collapse"
            href="#userMenu"
            aria-expanded="false"
          >
            <img className="user_img" src={user.avatar} alt="" />
            <p>{user.firstName}</p>
          </a>
          <div id="userMenu" className="collapse" aria-expanded="false">
            <ul className="account_submenus">
              <li>
                <Link to="#">Account Setting</Link>
              </li>
              <li>
                <Link to="#" onClick={this.onLogoutClick.bind(this)}>
                  Logout
                </Link>
              </li>
              <li>qwer</li>
              <li>qwer</li>
            </ul>
          </div>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-size">
        <div>
          <Link
            to="#"
            onClick={this.onClickHideSidebar}
            className="toggle_button"
          >
            <i className="fa fa-grip-vertical" />
          </Link>
        </div>
        <div className="head-title">
          {/* <span>{pageTitle}</span> */}
          {/* <Link to="/">{pageTitle}</Link> */}
        </div>
        <div className="spacer" />
        <div className="navbar_items" id="pangcol" aria-expanded="true">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  hideSideBar: PropTypes.func.isRequired,
  changePageTitle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  sidebar: state.sidebar,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile, changePageTitle, hideSideBar }
)(Navbar);
