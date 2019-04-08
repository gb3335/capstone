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
      by: this.props.auth.user.id
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

    let currentLink = window.location.href;
    let firstOccurencePath;
    let firstOccurence = currentLink.indexOf("/");
    firstOccurencePath = currentLink.substring(firstOccurence + 1, currentLink.length);
    let secondOccurencePath;
    let secondOccurence = firstOccurencePath.indexOf("/");
    secondOccurencePath = firstOccurencePath.substring(secondOccurence + 1, firstOccurencePath.length);
    let thirdOccurencePath;
    let thirdOccurence = secondOccurencePath.indexOf("/");
    thirdOccurencePath = secondOccurencePath.substring(thirdOccurence + 1, secondOccurencePath.length);
    let oldid;
    let oldlink;
    let fourthOccurencePath;
    let fourthOccurence;
    let backlink;
    if (thirdOccurencePath.includes("/")) {
      fourthOccurence = thirdOccurencePath.indexOf("/");
      fourthOccurencePath = thirdOccurencePath.substring(fourthOccurence + 1, thirdOccurencePath.length);
      oldid = fourthOccurencePath;
      oldlink = thirdOccurencePath.substring(0, fourthOccurence);
      backlink = `${oldlink}/${oldid}`
    }
    else {
      oldid = thirdOccurencePath;
      oldlink = thirdOccurencePath;
      backlink = `${oldlink}/${oldid}`
    }
    let toCompare = (`myaccount/${this.props.auth.user.id}`).length;
    let thisOldLink = (`myaccount/${this.props.auth.user.id}/${oldlink}/${oldid}`).length;


    if (thirdOccurencePath.substring(0, toCompare) === `myaccount/${this.props.auth.user.id}`) {

      backlink = thirdOccurencePath.substring(toCompare + 1, thisOldLink)
    }

    if (backlink === '/') {
      backlink = `0000/0000`;

    }



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
              <p>
                {user.name.firstName} {user.name.lastName}
              </p>
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
                  <Link to={`/myaccount/${this.props.auth.user.id}/${backlink}`} className="accountNavBarBtn">
                    <i className="fa fa-user-tie pl-2 pr-2" /> My Account <br />
                    <span>{user.userType}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={this.onLogoutClick.bind(this)}
                    className="logoutNavBarBtn"
                  >
                    <i className="fa fa-power-off pl-2 pr-2" /> Logout
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

        <div className="ml-3 navSearch">
          <SearchBar />
        </div>
        <div className="spacer" />

        <div
          className="navbar_items"
          id="pangcol"
          aria-expanded="true"
          style={{ fontSize: "14px" }}
        >
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
