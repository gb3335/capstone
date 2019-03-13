import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { getColleges } from "../../actions/collegeActions";
import { getResearches } from "../../actions/researchActions";

import "./Landing.css";
class Landing extends Component {
  componentDidMount() {
    this.props.getColleges();
    this.props.getResearches();
  }

  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2>
                  BulSU Plagiarism & Grammar Checker for Research Materials
                </h2>
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/bulsu_red.png"
                  alt="bulsu-logo"
                  style={{ width: "auto", height: "130px" }}
                />
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/CICT.png"
                  alt="cict-logo"
                  style={{ width: "auto", height: "130px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  getColleges: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired
};

export default connect(
  null,
  { getResearches, getColleges }
)(Landing);
