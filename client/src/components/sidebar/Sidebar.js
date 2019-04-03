import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { changePageTitle } from "../../actions/sidebarActions";
import "./Sidebar.css";

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      pageTitle: "",
      hide: false,
      sideclass: "sidebar ",
      aria: "false",
      accountAria: "false",
      forcol: "collapse minimenu",
      accountForcol: "collapse minimenu",
      rotate: "fa fa-caret-down rotate",
      accountRotate: "fa fa-caret-down rotate"
    };

    this.updateClass = this.updateClass.bind(this);
    this.updateAccountClass = this.updateAccountClass.bind(this);
  }

  updateClass = () => {
    const temp = this.state.rotate;
    let rotate;
    if (temp.length > 23) {
      rotate = "fa fa-caret-down rotate";
    } else {
      rotate = "fa fa-caret-down rotate down";
    }
    this.setState({ rotate });
  };

  updateAccountClass = () => {
    const temp = this.state.accountRotate;
    let accountRotate;
    if (temp.length > 23) {
      accountRotate = "fa fa-caret-down rotate";
    } else {
      accountRotate = "fa fa-caret-down rotate down";
    }
    this.setState({ accountRotate });
  };

  changeTitle = title => {
    this.props.changePageTitle(title);
  };

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

  onMouseAccountEnter = () => {
    let accountAria = "true";
    let accountForcol = "collapse minimenu show";

    this.setState({ accountAria, accountForcol });
  };

  onMouseAccountLeave = () => {
    let accountAria = "false";
    let accountForcol = "collapse minimenu";
    this.setState({ accountAria, accountForcol });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebar.hide) {
      const sideclass = "sidebar hide";
      this.setState({ sideclass });
    } else {
      const sideclass = "sidebar";
      this.setState({ sideclass });
    }
  }

  componentDidMount() {
    if (this.props.sidebar.hide) {
      const sideclass = "sidebar hide";
      this.setState({ sideclass });
    } else {
      const sideclass = "sidebar";
      this.setState({ sideclass });
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    let path = ""

    if (user.avatar === "/images/User.png") {
      path = "/images/User.png"
    }
    else {
      path = "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" + user.avatar;
    }

    const guestLinks = (
      <nav className="sidebar_navigation">
        <div className="sidebar_logo">
          <Link
            to="/"
            onClick={() => this.changeTitle("Welcome to our Website")}
          >
            BSU
          </Link>
        </div>
        <div className="sidebar_user">
          <div className="sidebar_user_image">
            <img src="/images/avatarGuest.png" alt="Your Avatar" />
          </div>
          <div className="sidebar_user_name">
            <Link to="/login">Guest</Link>
          </div>
        </div>

        <div className="sidebar_navigation_items">
          <ul>
            <li>
              <Link
                to="/dashboard"
                onClick={() => this.changeTitle("Dashboard")}
                className="parentA"
              >
                <i className="fa fa-chart-line" />
                <p>Dashboard</p>
              </Link>
            </li>

            <li>
              <Link
                to="/colleges"
                onClick={() => this.changeTitle("Colleges")}
                className="parentA"
              >
                <i className="fa fa-graduation-cap" />
                <p>Colleges</p>
              </Link>
            </li>
            <li>
              <Link
                to="/researches"
                onClick={() => this.changeTitle("Researches")}
                className="parentA"
              >
                <i className="fa fa-book" />
                <p>Researches</p>
              </Link>
            </li>
            <li>
              <Link
                to="/journals"
                onClick={() => this.changeTitle("Journals")}
                className="parentA"
              >
                <i className="fa fa-journal-whills" />
                <p>Journals</p>
              </Link>
            </li>
            <li className="multimenus forlarge">
              <a
                onClick={this.updateClass}
                className="parentA"
                id="plagiarism"
                data-toggle="collapse"
                href="#checkPlagiarism"
                aria-expanded="false"
              >
                <i className="fa fa-search" />
                <p className="pr-2">Check Plagiarism</p>
                <b id="rotate" className={this.state.rotate} />
              </a>

              <div
                id="checkPlagiarism"
                className="collapse"
                aria-expanded="false"
              >
                <div className="csstriangle" />
                <ul className="submenus nav">
                  <li>
                    <Link
                      to="/onlinecheck"
                      onClick={() =>
                        this.changeTitle("Check Plagiarism Online")
                      }
                    >
                      Online Check
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/localcheck"
                      onClick={() =>
                        this.changeTitle("Check Plagiarism Locally")
                      }
                    >
                      Local Check
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sidebyside"
                      onClick={() =>
                        this.changeTitle("Check Plagiarism Side by Side")
                      }
                    >
                      Side by side
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="multimenus formini">
              <a
                onClick={this.updateClass}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                className="parentA"
                id="plagiarism"
                data-toggle="collapse"
                href="#checkPlagiarism"
                aria-expanded={this.state.aria}
              >
                <i className="fa fa-search" />
                <p className="pr-2">Check Plagiarism</p>
                <b id="rotate" className={this.state.rotate} />
              </a>

              <div
                id="checkPlagiarism"
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                className={this.state.forcol}
                aria-expanded="false"
              >
                <div className="csstriangle" />
                <ul className="submenus nav">
                  <li>
                    <Link
                      to="/onlinecheck"
                      onClick={() =>
                        this.changeTitle("Check Plagiarism Online")
                      }
                    >
                      Online Check
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/localcheck"
                      onClick={() =>
                        this.changeTitle("Check Plagiarism Locally")
                      }
                    >
                      Local Check
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sidebyside"
                      onClick={() =>
                        this.changeTitle("Check Plagiarism Side by Side")
                      }
                    >
                      Side by side
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );

    let adminShowBig;
    let adminShowSmall;

    if (this.props.auth.user.userType === "ADMINISTRATOR") {
      adminShowBig = (
        <li className="multimenus forlarge">
          <a
            onClick={this.updateAccountClass}
            className="parentA"
            id="plagiarism"
            data-toggle="collapse"
            data-target="#accountClick"
            href="#accountClick"
            aria-expanded="false"
          >
            <i className="fa fa-users" />
            <p className="pr-2">Accounts</p>
            <b id="rotate" className={this.state.accountRotate} />
          </a>
          <div
            id="accountClick"
            className="collapse"
            aria-expanded="false"
          >
            <div className="csstriangle" />
            <ul className="submenus nav">
              <li>
                <Link
                  to="/viewusers"
                  onClick={() => this.changeTitle("Accounts")}

                >
                  Accounts
            </Link>
              </li>
              <li>
                <Link
                  to="/userlogs"
                  onClick={() =>
                    this.changeTitle("User Logs")
                  }
                >
                  User Logs
            </Link>
              </li>

            </ul>
          </div>
        </li>
      )
      adminShowSmall = (<li className="multimenus formini">
        <a
          onClick={this.updateClass}
          onMouseEnter={this.onMouseAccountEnter}
          onMouseLeave={this.onMouseAccountLeave}
          className="parentA"
          id="plagiarism"
          data-toggle="collapse"
          href="#accountClick"
          aria-expanded={this.state.accountAria}

        >
          <i className="fa fa-users" />
          <p className="pr-2">Accounts</p>
          <b id="rotate" className={this.state.rotate} />
        </a>

        <div
          id="accountClick"
          onMouseEnter={this.onMouseAccountEnter}
          onMouseLeave={this.onMouseAccountLeave}
          className={this.state.accountForcol}
          aria-expanded="false"
        >
          <div className="csstriangle" />
          <ul className="submenus nav">
            <li>
              <Link
                to="/viewusers"
                onClick={() => this.changeTitle("Accounts")}

              >
                Accounts
                    </Link>
            </li>
            <li>
              <Link
                to="/userlogs"
                onClick={() =>
                  this.changeTitle("User Logs")
                }
              >
                User Logs
                    </Link>
            </li>
          </ul>
        </div>
      </li>)
    }

    const replaceString = require("replace-string");
    let strstart = 0;
    let a = window.location.href;
    let oldpath;
    let oldid;

    let mylink;

    let b = replaceString(a, "http://localhost:3000/", "");
    if (b.includes("/")) {
      strstart = b.indexOf("/");
      oldpath = b.substring(0, strstart);
      oldid = b.substring(strstart + 1, b.length);
      mylink =
        "/myaccount/" + this.props.auth.user.id + "/" + oldpath + "/" + oldid;
    } else {
      if (b === "") {
        mylink =
          "/myaccount/" +
          this.props.auth.user.id +
          "/" +
          "undefined" +
          "/" +
          oldid;
      } else {
        mylink =
          "/myaccount/" + this.props.auth.user.id + "/" + b + "/" + oldid;
      }
    }
    if (
      "/myaccount/" +
      this.props.auth.user.id +
      "/myaccount/" +
      this.props.auth.user.id ===
      mylink.substring(
        0,
        (
          "/myaccount/" +
          this.props.auth.user.id +
          "/myaccount/" +
          this.props.auth.user.id
        ).length
      )
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
        <nav className="sidebar_navigation">
          <div className="sidebar_logo">
            <Link
              to="/"
              onClick={() => this.changeTitle("Welcome to our Website")}
            >
              BSU
            </Link>
          </div>
          <div className="sidebar_user">
            <div className="sidebar_user_image">

              <div
                className="squareSide"
                style={{ backgroundImage: `url('${path}')` }}
              />

            </div>
            <div className="sidebar_user_name">
              <Link to={oldlink}>{user.name.firstName}  {user.name.lastName}</Link>
            </div>
          </div>

          <div className="sidebar_navigation_items">
            <ul>
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => this.changeTitle("Dashboard")}
                  className="parentA"
                >
                  <i className="fa fa-chart-line" />
                  <p>Dashboard</p>
                </Link>
              </li>
              {adminShowBig}
              {adminShowSmall}
              <li>
                <Link
                  to="/colleges"
                  onClick={() => this.changeTitle("Colleges")}
                  className="parentA"
                >
                  <i className="fa fa-graduation-cap" />
                  <p>Colleges</p>
                </Link>
              </li>
              <li>
                <Link
                  to="/researches"
                  onClick={() => this.changeTitle("Researches")}
                  className="parentA"
                >
                  <i className="fa fa-book" />
                  <p>Researches</p>
                </Link>
              </li>
              <li>
                <Link
                  to="/journals"
                  onClick={() => this.changeTitle("Journals")}
                  className="parentA"
                >
                  <i className="fa fa-journal-whills" />
                  <p>Journals</p>
                </Link>
              </li>
              <li className="multimenus forlarge">
                <a
                  onClick={this.updateClass}
                  className="parentA"
                  id="plagiarism"
                  data-toggle="collapse"
                  href="#checkPlagiarism"
                  aria-expanded="false"
                >
                  <i className="fa fa-search" />
                  <p className="pr-2">Check Plagiarism</p>
                  <b id="rotate" className={this.state.rotate} />
                </a>

                <div
                  id="checkPlagiarism"
                  className="collapse"
                  aria-expanded="false"
                >
                  <div className="csstriangle" />
                  <ul className="submenus nav">
                    <li>
                      <Link
                        to="/onlinecheck"
                        onClick={() =>
                          this.changeTitle("Check Plagiarism Online")
                        }
                      >
                        Online Check
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/localcheck"
                        onClick={() =>
                          this.changeTitle("Check Plagiarism Locally")
                        }
                      >
                        Local Check
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/sidebyside"
                        onClick={() =>
                          this.changeTitle("Check Plagiarism Side by Side")
                        }
                      >
                        Side by side
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="multimenus formini">
                <a
                  onClick={this.updateClass}
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  className="parentA"
                  id="plagiarism"
                  data-toggle="collapse"
                  href="#checkPlagiarism"
                  aria-expanded={this.state.aria}
                >
                  <i className="fa fa-search" />
                  <p className="pr-2">Check Plagiarism</p>
                  <b id="rotate" className={this.state.rotate} />
                </a>

                <div
                  id="checkPlagiarism"
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  className={this.state.forcol}
                  aria-expanded="false"
                >
                  <div className="csstriangle" />
                  <ul className="submenus nav">
                    <li>
                      <Link
                        to="/onlinecheck"
                        onClick={() =>
                          this.changeTitle("Check Plagiarism Online")
                        }
                      >
                        Online Check
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/localcheck"
                        onClick={() =>
                          this.changeTitle("Check Plagiarism Locally")
                        }
                      >
                        Local Check
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/sidebyside"
                        onClick={() =>
                          this.changeTitle("Check Plagiarism Side by Side")
                        }
                      >
                        Side by side
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link
                  to="/grammar"
                  onClick={() => this.changeTitle("Grammar")}
                  className="parentA"
                >
                  <i className="fa fa-book-reader" />
                  <p>Check Grammar</p>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      );
    }


    return (
      <div>
        <div
          className={this.state.sideclass}
          style={{ backgroundImage: `url(/images/bsuback.JPG)` }}
        >
          <div className="sidebar_transparent">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  changePageTitle: Proptypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  sidebar: state.sidebar
});
export default connect(
  mapStateToProps,
  { changePageTitle }
)(Sidebar);
