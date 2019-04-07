import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { Parallax, Background } from "react-parallax";

import {
  getColleges,
  getCollegeByInitials
} from "../../actions/collegeActions";
import { getResearches } from "../../actions/researchActions";
import { getUsers } from "../../actions/userActions";
import { getJournals } from "../../actions/journalActions";

import "./Landing.css";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greet: "",
      day: "",
      color: ""
    };
  }

  componentWillMount() {
    this.props.getColleges();
    this.props.getResearches();
    this.props.getUsers();
    this.props.getJournals();
  }

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
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bsumaingate.jpg";
    const image2 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/law.jpg";
    const image3 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/heroespark.jpg";
    const image4 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bulsu114.jpg";

    return (
      <div>
        <div style={styles}>
          {/* <Hello name="Parallax" /> */}
          <Parallax bgImage={image1} strength={300}>
            <div style={{ height: 500 }}>
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
