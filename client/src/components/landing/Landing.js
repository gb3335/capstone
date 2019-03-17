import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";

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

    return (
      <div>
        <div className="landing">
          <div className="dark-overlay landing-inner text-light">
            <div className="row">
              <div className="col-12 text-center">
                <h3 className="display-4 text-center">
                  BulSU Plagiarism and Grammar Checker
                  <hr />
                  <p style={{ fontSize: "30px" }}>
                    <i
                      class={this.state.day}
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
        <div />
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
