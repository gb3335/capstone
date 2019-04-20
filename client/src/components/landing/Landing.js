import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { Parallax, Background } from "react-parallax";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  getColleges,
  getCollegeByInitials
} from "../../actions/collegeActions";
import { getResearches } from "../../actions/researchActions";
import { getUsers } from "../../actions/userActions";
import { getJournals } from "../../actions/journalActions";
import { Redirect } from "react-router";
import "./Landing.css";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greet: "",
      day: "",
      color: "",
      alert: this.props.auth.user.passwordUpdated === 0 ? true : false,
      redirect: false
    };
  }
  onCancel = () => {
    this.setState({ alert: false });
  };
  onUpdate = () => {
    window.location.href = `/edit-password`;
  };
  componentWillMount() {
    this.props.getColleges();
    this.props.getResearches();
    this.props.getUsers();
    this.props.getJournals();
  }
  handleOnClick = () => {
    // some action...
    // then redirect
    this.setState({ redirect: true });
  };
  componentDidMount() {
    let currentHour = moment().format("HH");
    currentHour = parseInt(currentHour, 10);

    if (currentHour >= 12 && currentHour <= 17) {
      this.setState({
        greet: "Good Afternoon",
        day: `fas fa-sun`,
        color: "#D35400"
      });
    } else if (currentHour <= 11) {
      this.setState({
        greet: "Good Morning",
        day: `fas fa-cloud-sun`,
        color: "#F7DC6F"
      });
    } else {
      this.setState({
        greet: "Good Evening",
        day: `fas fa-cloud-moon`,
        color: "#7F8C8D"
      });
    }
  }

  render() {
    let name;
    if (this.state.redirect) {
      return <Redirect push to={`/edit-password`} />;
    }

    try {
      this.props.getCollegeByInitials(this.props.colleges[0].name.initials);
    } catch (error) {}

    if (this.props.auth.isAuthenticated) {
      name = ", " + this.props.auth.user.name.firstName;
    }

    const styles = {
      fontFamily: "sans-serif",
      textAlign: "center"
    };
    const insideStyles = {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      color: "white",
      fontFamily: "ABeeZee",
      fontSize: "30px",
      //padding: 20,
      position: "absolute",
      width: "100%",
      zIndex: "1",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)"
    };

    const image1 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/gateOne.jpg";
    const image2 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/law.jpg";
    const image3 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/parkbulsu.jpg";
    const image4 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bulsu114.jpg";

    return (
      <div>
        <SweetAlert
          show={this.state.alert}
          warning
          showCancel
          confirmBtnText="Yes, update password!"
          confirmBtnBsStyle="success"
          cancelBtnText="Later"
          cancelBtnBsStyle="default"
          title="Update Password?"
          onConfirm={this.handleOnClick}
          onCancel={this.onCancel}
        >
          The system detected that you are using our system generated password.
          Would you like to update your password?
        </SweetAlert>

        {/* 
        <div style={styles}>
          <Parallax bgImage={image1} strength={300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>
                <img
                  src="./images/3dlogo.gif"
                  alt="logo-3d"
                  style={{ width: "120px" }}
                />
                <div classNameName="hide">
                  <br />
                </div>
                Plagiarism and Grammar Checker System for Bulacan State
                University Research Materials
              </div>
            </div>
          </Parallax>
          <br />
          <br />
          <Parallax bgImage={image2} strength={300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Plagiarism Checker</div>
            </div>
          </Parallax>
          <br />
          <br />

          <Parallax bgImage={image3} strength={300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Grammar Checker</div>
            </div>
          </Parallax>
          <br />
          <br />
          <Parallax bgImage={image4} strength={300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>
                Android App
                <br />
                <a
                  target="_blank"
                  href="https://i.kym-cdn.com/photos/images/newsfeed/000/237/357/9d8.jpg"
                  className="btn btn-info"
                >
                  Download here
                </a>
              </div>
            </div>
          </Parallax>
        </div>
        <br />
        <br /> */}

        <div style={styles}>
          <Parallax bgImage={image1} strength={0}>
            <div style={{ height: 900 }}>
              <div style={insideStyles}>
                <img
                  src="./images/3dlogo.gif"
                  alt="logo-3d"
                  style={{ width: "120px" }}
                />
                <div className="hide">
                  <br />
                </div>
                Plagiarism and Grammar Checker System for Bulacan State
                University Research Materials
              </div>
            </div>
          </Parallax>
        </div>

        <br />

        <section className="about" id="about">
          <div className="container text-center">
            <h2 style={{ fontFamily: "Raleway, Helvetica, Arial, sans-serif" }}>
              About
            </h2>

            <p>
              Plagiarism and Grammar Checker System for Bulacan State University
              Research Materials is created with the intentions of keeping the
              research office works hassle-free and fast. With our fast and
              accurate Plagiarism Checker and other features such as the Grammar
              Checker we can ensure that the process in the research office will
              be much more faster. This system also acts as a repository for
              College Research and Journals. We also have an android application
              for the users convinience they can use it anytime, anywhere even
              without an internet connection.
            </p>

            {/* <div className="row stats-row">
              <div className="stats-col text-center col-md-3 col-sm-6">
                <div className="circle">
                  <span className="stats-no" data-toggle="counter-up">
                    98%
                  </span>{" "}
                  IT Expert
                </div>
              </div>

              <div className="stats-col text-center col-md-3 col-sm-6">
                <div className="circle">
                  <span className="stats-no" data-toggle="counter-up">
                    46%
                  </span>{" "}
                  Students
                </div>
              </div>

              <div className="stats-col text-center col-md-3 col-sm-6">
                <div className="circle">
                  <span className="stats-no" data-toggle="counter-up">
                    92%
                  </span>{" "}
                  Librarians
                </div>
              </div>

              <div className="stats-col text-center col-md-3 col-sm-6">
                <div className="circle">
                  <span className="stats-no" data-toggle="counter-up">
                    14%
                  </span>{" "}
                  Tricycle Drivers
                </div>
              </div> 
            </div>*/}
          </div>
        </section>

        <br />

        <Parallax bgImage={image3} strength={300}>
          <div style={{ height: 400 }} />
        </Parallax>

        <br />

        <section className="features" id="features">
          <div className="container">
            <h2
              className="text-center"
              style={{ fontFamily: "Raleway, Helvetica, Arial, sans-serif" }}
            >
              Features
            </h2>

            <div className="row">
              <div className="feature-col col-lg-4 col-xs-12">
                <div className="card card-block text-center border-0">
                  <div>
                    <div className="feature-icon">
                      <span className="fas fa-rocket" />
                    </div>
                  </div>

                  <div>
                    <h4>Fast Plagiarism Checker</h4>

                    <p>
                      Check a research document for potential plagiarism content
                      in just a matter of minutes!
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-col col-lg-4 col-xs-12">
                <div className="card card-block text-center border-0">
                  <div>
                    <div className="feature-icon">
                      <span className="fas fa-file-word" />
                    </div>
                  </div>

                  <div>
                    <h4>Grammar Checker</h4>

                    <p>
                      See if there's any grammatical error in your sentences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-col col-lg-4 col-xs-12">
                <div className="card card-block text-center border-0">
                  <div>
                    <div className="feature-icon">
                      <span className="fas fa-times" />
                    </div>
                  </div>

                  <div>
                    <h4>No Word Limit</h4>

                    <p>
                      Don't worry for any word limitations in our local
                      plagiarism checker.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="feature-col col-lg-4 col-xs-12">
                <div className="card card-block text-center border-0">
                  <div>
                    <div className="feature-icon">
                      <span className="fab fa-android" />
                    </div>
                  </div>

                  <div>
                    <h4>Android Application</h4>

                    <p>
                      Check research abstracts anytime, anywhere! Even if your
                      not connected to the internet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-col col-lg-4 col-xs-12">
                <div className="card card-block text-center border-0">
                  <div>
                    <div className="feature-icon">
                      <span className="fas fa-database" />
                    </div>
                  </div>

                  <div>
                    <h4>Document Repository</h4>

                    <p>Easily find and organize researches and journals.</p>
                  </div>
                </div>
              </div>

              <div className="feature-col col-lg-4 col-xs-12">
                <div className="card card-block text-center border-0">
                  <div>
                    <div className="feature-icon">
                      <span className="fas fa-user-shield" />
                    </div>
                  </div>

                  <div>
                    <h4>Email Verification</h4>

                    <p>
                      For security, this website uses an email verification for
                      user registration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <br />
        <Parallax bgImage={image4} strength={300}>
          <div style={{ height: 400 }} />
        </Parallax>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

Landing.propTypes = {
  getColleges: PropTypes.func.isRequired,
  getCollegeByInitials: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  getJournals: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  colleges: state.college.colleges
});

export default connect(
  mapStateToProps,
  { getResearches, getColleges, getUsers, getJournals, getCollegeByInitials }
)(Landing);
