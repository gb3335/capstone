import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { Parallax, Background } from "react-parallax";

import { getColleges } from "../../actions/collegeActions";
import { getResearches } from "../../actions/researchActions";

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

  componentDidMount() {
    this.props.getColleges();
    this.props.getResearches();

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

    if (this.props.auth.isAuthenticated) {
      name = ", " + this.props.auth.user.firstName;
    }

    const styles = {
      fontFamily: "sans-serif",
      textAlign: "center"
    };
    const insideStyles = {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      fontFamily: "ABeeZee",
      fontSize: "30px",
      padding: 20,
      position: "absolute",
      zIndex: "1",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)"
    };

    const image1 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bulsumaingate.jpg";
    const image2 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bg1.png";
    const image3 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bg2.png";
    const image4 =
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/empire-state-building-black-and-white-square-format-john-farnan.jpg";

    return (
      <div>
        <div style={styles}>
          {/* <Hello name="Parallax" /> */}
          <Parallax bgImage={image1} strength={300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>
                BulSU Plagiarism & Grammar Checker <br />
                <i
                  className={this.state.day}
                  style={{ color: this.state.color }}
                />{" "}
                {this.state.greet}
                {name}
              </div>
            </div>
          </Parallax>
          <h1>
            {"\u25CC"} {"\u25CC"} {"\u25CC"}
          </h1>
          <Parallax bgImage={image2} strength={-300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Plagiarism Checker</div>
              <div id="books">
                <img id="bookimg" src="./images/books.png" alt="books" />
              </div>
            </div>
          </Parallax>
          <h1>
            {"\u25CC"} {"\u25CC"} {"\u25CC"}
          </h1>

          <Parallax bgImage={image3} strength={300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Grammar Checker</div>
              <div id="books">
                <img id="writeimg" src="./images/writing.png" alt="books" />
              </div>
            </div>
          </Parallax>
          <h1>
            {"\u25CC"} {"\u25CC"} {"\u25CC"}
          </h1>
          <Parallax bgImage={image4} strength={-300}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Android App</div>
            </div>
          </Parallax>
          <div style={{ height: 500 }} />
          <h2>{"\u2728"}</h2>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  getColleges: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getResearches, getColleges }
)(Landing);
