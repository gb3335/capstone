import React, { Component } from "react";
import { connect } from "react-redux";
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
      <div className="container-fluid p-2">
        Landing page goes here
        <div className="test" />
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
