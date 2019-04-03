import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import SearchBar from "./SearchBar";

import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/authActions";
import { changePageTitle } from "../../actions/sidebarActions";
import { hideSideBar } from "../../actions/sidebarActions";

import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aria: "false",
      forcol: "collapse minimenu"
    };
  }

  onMouseEnter = () => {
    let aria = "true";
    let forcol = "collapse minimenu show";

    this.setState({ aria, forcol });
  };

  onMouseLeave = () => {
    let aria = "false";
    let forcol = "collapse minimenu";
    this.setState({ aria, forcol });
  };

  onLogoutClick(e) {
    // const newUser = new UserLog({
    //   name: {
    //     firstName: user.name.firstName,
    //     middleName: user.name.middleName,
    //     lastName: user.name.lastName
    //   },
    //   email: user.email,
    //   avatar: user.avatar,
    //   isBlock: user.isBlock,
    //   userType: user.usertype,
    //   college: user.college,
    //   contact: user.contact,
    //   type: "Login"
    // });


    const userData = {
      name: {
        firstName: this.props.auth.user.name.firstName,
        middleName: this.props.auth.user.name.middleName,
        lastName: this.props.auth.user.name.lastName
      },
      email: this.props.auth.user.email,
      avatar: this.props.auth.user.avatar,
      isBlock: this.props.auth.user.isBlock,
      userType: this.props.auth.user.userType,
      college: this.props.auth.user.college,
      contact: this.props.auth.user.contact,
    };


    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser(userData, this.props.history);
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
    let path = "";

    if (user.avatar === "/images/User.png") {
      path = "/images/User.png";
    } else {
      path =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" +
        user.avatar;
    }

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

    const replaceString = require("replace-string");
    let strstart = 0;
    let currentLink = window.location.href;
    let oldpath;
    let oldid;
    let linkCutted;

    let mylink;
    if (currentLink.includes("http://34.229.6.94/")) {
      linkCutted = replaceString(currentLink, "http://34.229.6.94/", "");
    }
    else {
      linkCutted = replaceString(currentLink, "http://localhost:3000/", "");
    }



    if (linkCutted.includes("/")) {
      strstart = linkCutted.indexOf("/");
      oldpath = linkCutted.substring(0, strstart);
      oldid = linkCutted.substring(strstart + 1, linkCutted.length);
      mylink = "/myaccount/" + this.props.auth.user.id + "/" + oldpath + "/" + oldid;

    } else {
      if (linkCutted === "") {
        mylink =
          "/myaccount/" +
          this.props.auth.user.id +
          "/" +
          "undefined" +
          "/" +
          oldid;
      } else {


        mylink =
          "/myaccount/" + this.props.auth.user.id + "/" + linkCutted + "/" + oldid;

      }
    }
    if (
      "/myaccount/" + this.props.auth.user.id + "/myaccount/" + this.props.auth.user.id ===
      mylink.substring(0, ("/myaccount/" + this.props.auth.user.id + "/myaccount/" + this.props.auth.user.id).length)
    ) {
      mylink = mylink.substring(
        ("/myaccount/" + this.props.auth.user.id).length,
        mylink.length
      );
    }


    let oldlink = mylink;
    mylink = "";


    let authLinks;

    if (isAuthenticated) {
      authLinks = (
        <ul className="mainUL">
          <li className="mainLI">
            <a
              className="collapsed account_button"
              id="account"
              data-toggle="collapse"
              href="#userMenu"
              aria-expanded={this.state.aria}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
            >
              <img className="user_img" src={path} alt="" />
              <p>{user.name.firstName} {user.name.lastName}</p>
            </a>
            <div
              id="userMenu"
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              className={this.state.forcol}
              aria-expanded="false"
            >
              <div className="csstriangleForNavbar" />
              <div className="invisibleNavbarDiv" />
              <ul className="account_submenus">
                <li>
                  <Link to={oldlink} className="accountNavBarBtn"><i className="fa fa-user-tie pl-2 pr-2"></i> My Account <br /><span>{user.userType}</span></Link>
                </li>
                <li>
                  <Link to="#" onClick={this.onLogoutClick.bind(this)} className="logoutNavBarBtn">
                    <i className="fa fa-power-off pl-2 pr-2"></i> Logout
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      );
    }


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
        <div className="ml-3" style={{ width: "40vw" }}>
          <SearchBar />
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
