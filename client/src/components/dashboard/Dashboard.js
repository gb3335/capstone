import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import "moment-timezone";

import "./Dashboard.css";

import Spinner from "../common/Spinner";
import DoughnutChart from "../common/DoughnutChart";

import { getColleges } from "../../actions/collegeActions";
import { changePageTitle } from "../../actions/sidebarActions";
import { getActivities } from "../../actions/activityActions";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      hide: false,
      sideclass: "navmain",
      college: {},
      activity: {}
    };
  }

  componentDidMount() {
    this.props.getColleges();
    this.props.getActivities();
    this.props.changePageTitle("Dashboard");
  }

  render() {
    const { colleges, loading } = this.props.college;
    const { activities } = this.props.activity;
    const actLoading = this.props.activity.loading;
    let researchData;
    let journalData;
    let dashboardItems;
    let activityItems;

    let recentActivities = [];

    if (activities === null || actLoading || activities === undefined) {
      activityItems = (
        <div className="row">
          <div className="col-md-12 mt-5 mb-5">
            <Spinner />
          </div>
        </div>
      );
    } else {
      try {
        activities.map(activity =>
          recentActivities.push(
            <p key={activity._id}>
              <b>{activity.title}</b> <Moment fromNow>{activity.date}</Moment>
            </p>
          )
        );

        activityItems = (
          <div style={{ overflow: "auto", height: "25rem" }}>
            {recentActivities}
          </div>
        );
      } catch (error) {}
    }

    if (colleges === null || loading) {
      dashboardItems = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else {
      try {
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
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{ textAlign: "center" }}
                      >
                        Researches
                      </h5>
                      <DoughnutChart data={researchData} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{ textAlign: "center" }}
                      >
                        Journals
                      </h5>
                      <DoughnutChart data={journalData} />
                    </div>
                  </div>
                </div>
              </div>
              <br />
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body pr-0">
                  <h5 className="card-title" style={{ textAlign: "center" }}>
                    Recent Activities
                  </h5>
                  {activityItems}
                </div>
              </div>
            </div>
          </div>
        );
      } catch (error) {}
    }

    return (
      <div className="container-fluid">
        <h1 className="display-4 text-center">Dashboard</h1>
        <p className="lead text-center">
          See all college researches and journals in graphs
        </p>
        {dashboardItems}
      </div>
    );
  }
}

Dashboard.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
  getColleges: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  activity: state.activity
});

export default connect(
  mapStateToProps,
  { changePageTitle, getColleges, getActivities }
)(Dashboard);
