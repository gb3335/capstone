import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import "moment-timezone";
import windowSize from "react-window-size";

import "./Dashboard.css";

import Spinner from "../common/Spinner";
import DoughnutChart from "../common/DoughnutChart";
import HorizontalBarChart from "../common/HorizontalBarChart";

import { getColleges } from "../../actions/collegeActions";
import { getResearches } from "../../actions/researchActions";
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
    this.props.getResearches();
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
    let researchDiv;
    let journalDiv;
    let graphsDiv;
    let activityDiv = "col-md-12";
    let recactDiv;
    let summaryDiv;
    let graphDiv = "row";
    let graphLegendDisplay;
    let resTot = 0;
    let jourTot = 0;

    let recentActivities = [];

    if (this.props.windowWidth <= 450) {
      graphLegendDisplay = true;
    }

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
              <b>
                {activity.title} {`by ${activity.by}`}
              </b>{" "}
              <Moment fromNow>{activity.date}</Moment>
            </p>
          )
        );

        activityItems = (
          <div style={{ overflow: "auto", height: "450px", fontSize: "13px" }}>
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
        let researchCtr = 0;
        let journalCtr = 0;
        colleges.map(college => {
          researchCtr += parseInt(college.researchTotal, 10);
          journalCtr += parseInt(college.journalTotal, 10);
        });

        // RESEARCH CHART
        if (researchCtr > 0) {
          researchData = {
            labels: colleges.map(college =>
              college.deleted === 0 ? college.name.initials : null
            ),
            datasets: [
              {
                data: colleges.map(college =>
                  college.deleted === 0 ? college.researchTotal : null
                ),
                backgroundColor: colleges.map(college =>
                  college.deleted === 0 ? college.color : null
                )
              }
            ]
          };

          let div;
          if (journalCtr > 0) {
            div = "col-md-6";
            graphsDiv = "col-md-9";
            activityDiv = "col-md-3";
          } else {
            div = "col-md-12";
            graphsDiv = "col-md-7";
            activityDiv = "col-md-5";
          }

          const labelsFiltered = researchData.labels.filter(function(el) {
            return el != null;
          });
          const datasetsDataFiltered = researchData.datasets[0].data.filter(
            function(el) {
              return el != null;
            }
          );
          const datasetsColorFiltered = researchData.datasets[0].backgroundColor.filter(
            function(el) {
              return el != null;
            }
          );

          const researchDataFiltered = {
            labels: labelsFiltered,
            datasets: [
              {
                data: datasetsDataFiltered,
                backgroundColor: datasetsColorFiltered
              }
            ]
          };

          researchDiv = (
            <div className={div}>
              <div className="card-body">
                <h5 className="card-title" style={{ textAlign: "center" }}>
                  Researches
                </h5>
                <DoughnutChart data={researchDataFiltered} />
              </div>
            </div>
          );
        }

        // JOURNAL CHART
        if (journalCtr > 0) {
          journalData = {
            labels: colleges.map(college =>
              college.deleted === 0 ? college.name.initials : null
            ),
            datasets: [
              {
                data: colleges.map(college =>
                  college.deleted === 0 ? college.journalTotal : null
                ),
                backgroundColor: colleges.map(college =>
                  college.deleted === 0 ? college.color : null
                )
              }
            ]
          };

          let div;
          if (researchCtr > 0) {
            div = "col-md-6";
            graphsDiv = "col-md-9";
            activityDiv = "col-md-3";
          } else {
            div = "col-md-12";
            graphsDiv = "col-md-7";
            activityDiv = "col-md-5";
          }

          const labelsFiltered1 = journalData.labels.filter(function(el) {
            return el != null;
          });
          const datasetsDataFiltered1 = journalData.datasets[0].data.filter(
            function(el) {
              return el != null;
            }
          );
          const datasetsColorFiltered1 = journalData.datasets[0].backgroundColor.filter(
            function(el) {
              return el != null;
            }
          );

          const journalDataFiltered = {
            labels: labelsFiltered1,
            datasets: [
              {
                data: datasetsDataFiltered1,
                backgroundColor: datasetsColorFiltered1
              }
            ]
          };

          journalDiv = (
            <div className={div}>
              <div className="card-body">
                <h5 className="card-title" style={{ textAlign: "center" }}>
                  Journals
                </h5>
                <DoughnutChart data={journalDataFiltered} />
              </div>
            </div>
          );
        }

        if (this.props.auth.isAuthenticated) {
          recactDiv = (
            <div className={activityDiv}>
              <div className="card">
                <div className="card-body pr-0">
                  <h5 className="card-title" style={{ textAlign: "center" }}>
                    Recent Activities
                  </h5>
                  {activityItems}
                </div>
              </div>
              <br />
            </div>
          );
        } else {
          graphDiv = "container";
          graphsDiv = "col-md-12";
        }

        // SUMMARY CHART
        let summaryData = {
          labels: colleges.map(college =>
            college.deleted === 0 ? college.name.initials : null
          ),
          datasets: [
            {
              data: colleges.map(college =>
                college.deleted === 0
                  ? `${parseInt(college.journalTotal, 10) +
                      parseInt(college.researchTotal, 10)}`
                  : null
              ),
              backgroundColor: colleges.map(college =>
                college.deleted === 0 ? college.color : null
              )
            }
          ]
        };

        const sumlabelsFiltered1 = summaryData.labels.filter(function(el) {
          return el != null;
        });
        const sumdatasetsDataFiltered1 = summaryData.datasets[0].data.filter(
          function(el) {
            return el != null;
          }
        );
        const sumdatasetsColorFiltered1 = summaryData.datasets[0].backgroundColor.filter(
          function(el) {
            return el != null;
          }
        );

        const journalDataFiltered = {
          labels: sumlabelsFiltered1,
          datasets: [
            {
              data: sumdatasetsDataFiltered1,
              backgroundColor: sumdatasetsColorFiltered1
            }
          ]
        };

        summaryDiv = (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body pr-0">
                <h5 className="card-title" style={{ textAlign: "center" }}>
                  Summary of Research & Journals per College
                </h5>
                <HorizontalBarChart data={journalDataFiltered} />
              </div>
            </div>
          </div>
        );
        // Research and Journal Total for top text
        colleges.map(college => {
          resTot += parseInt(college.researchTotal, 10);
          jourTot += parseInt(college.journalTotal, 10);
        });

        dashboardItems = (
          <div>
            <b>Research Total: </b>
            {resTot}
            {"  "}
            <b>Journal Total: </b>
            {jourTot}
            <div className={graphDiv}>
              <div className={graphsDiv}>
                <div className="card">
                  <div className="row">
                    {researchDiv}
                    {journalDiv}
                  </div>
                </div>
                <br />
              </div>
              {recactDiv}
              {summaryDiv}
            </div>
          </div>
        );
      } catch (error) {}
    }

    return (
      <div className="container-fluid">
        {/* <h1 className="display-4 text-center">Dashboard</h1>
        <p className="lead text-center">
          See all college researches and journals in graphs
        </p> */}
        {dashboardItems}
      </div>
    );
  }
}

Dashboard.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
  getColleges: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  activity: state.activity,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { changePageTitle, getColleges, getActivities, getResearches }
)(windowSize(Dashboard));
