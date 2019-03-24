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
      background: "white",
      padding: 20,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)"
    };
    const image1 =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bulsumaingate.jpg";
    const image2 =
      "https://img00.deviantart.net/2bd0/i/2009/276/c/9/magic_forrest_wallpaper_by_goergen.jpg";
    const image3 =
      "https://brightcove04pmdo-a.akamaihd.net/5104226627001/5104226627001_5297440765001_5280261645001-vs.jpg?pubId=5104226627001&videoId=5280261645001";
    const image4 =
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/empire-state-building-black-and-white-square-format-john-farnan.jpg";

    return (
      <div>
        <div style={styles}>
          {/* <Hello name="Parallax" /> */}
          <Parallax bgImage={image1} strength={500}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>BulSU Plagiarism & Grammar Checker</div>
            </div>
          </Parallax>
          <h1>
            {"\u25CC"} {"\u25CC"} {"\u25CC"}
          </h1>
          <Parallax bgImage={image3} blur={{ min: -1, max: 3 }}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Dynamic Blur</div>
            </div>
          </Parallax>
          <h1>
            {"\u25CC"} {"\u25CC"} {"\u25CC"}
          </h1>
          <Parallax bgImage={image2} strength={-100}>
            <div style={{ height: 500 }}>
              <div style={insideStyles}>Reverse direction</div>
            </div>
          </Parallax>
          <h1>
            {"\u25CC"} {"\u25CC"} {"\u25CC"}
          </h1>
          <Parallax
            bgImage={image4}
            strength={200}
            renderLayer={percentage => (
              <div>
                <div
                  style={{
                    position: "absolute",
                    background: `rgba(255, 125, 0, ${percentage * 1})`,
                    left: "50%",
                    top: "50%",
                    borderRadius: "50%",
                    transform: "translate(-50%,-50%)",
                    width: percentage * 500,
                    height: percentage * 500
                  }}
                />
              </div>
            )}
          >
            <div style={{ height: 500 }}>
              <div style={insideStyles}>renderProp</div>
            </div>
          </Parallax>
          <div style={{ height: 500 }} />
          <h2>{"\u2728"}</h2>
        </div>
        {/* <div className="landing">
          <div className="dark-overlay landing-inner text-light">
            <div className="row">
              <div className="col-12 text-center">
                <h3 className="display-4 text-center">
                  BulSU Plagiarism and Grammar Checker
                  <hr />
                  <p style={{ fontSize: "30px" }}>
                    <i
                      className={this.state.day}
                      style={{ color: this.state.color }}
                    />{" "}
                    {this.state.greet}
                    {name}
                  </p>
                </h3>
                <br />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div /> */}
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
