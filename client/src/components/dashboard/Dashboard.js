import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changePageTitle } from "../../actions/sidebarActions";
import "./Dashboard.css";
import Spinner from "../common/Spinner";
import DoughnutChart from "../common/DoughnutChart";
import { getColleges } from "../../actions/collegeActions";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      hide: false,
      sideclass: "navmain"
    };
  }

  componentWillMount() {
    this.props.getColleges();
    this.props.changePageTitle("Dashboard");
  }

  render() {
    const { colleges, loading } = this.props.college;
    let researchData;
    let journalData;
    let dashboardItems;

    if (colleges === null || loading) {
      dashboardItems = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      researchData = {
        labels: colleges.map(college => college.name.initials),
        datasets: [
          {
            data: colleges.map(college => college.researchTotal),
            backgroundColor: colleges.map(college => college.color),
            hoverBackgroundColor: colleges.map(college => college.color)
          }
        ]
      };

      journalData = {
        labels: colleges.map(college => college.name.initials),
        datasets: [
          {
            data: colleges.map(college => college.journalTotal),
            backgroundColor: colleges.map(college => college.color),
            hoverBackgroundColor: colleges.map(college => college.color)
          }
        ]
      };

      dashboardItems = (
        <div className="row">
          <div className="col-md-6">
            <DoughnutChart data={researchData} chartTitle="College Research" />
          </div>
          <div className="col-md-6">
            <DoughnutChart data={journalData} chartTitle="College Journal" />
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid p-2">
        <h1 className="display-4 text-center">Dashboard</h1>
        <p className="lead text-center">
          See all colleges researches and journals in graphs
        </p>
        {dashboardItems}
      </div>
    );
  }
}

Dashboard.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college
});

export default connect(
  mapStateToProps,
  { changePageTitle, getColleges }
)(Dashboard);
