import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment-timezone";

import "./Dashboard.css";

import Spinner from "../common/Spinner";
import DoughnutChart from "../common/DoughnutChart";
import HorizontalBarChart from "../common/HorizontalBarChart";

import { getColleges } from "../../actions/collegeActions";
import { getResearches } from "../../actions/researchActions";
import { changePageTitle } from "../../actions/sidebarActions";
import { getActivities } from "../../actions/activityActions";
import { getUsers } from "../../actions/userActions";
import { getJournals } from "../../actions/journalActions";

class Dashboard extends Component {
  constructor(props) {
    super(props);
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
    this.props.getUsers();
    this.props.getJournals();
    this.props.changePageTitle("Dashboard");
  }

  render() {
    const { colleges, loading } = this.props.college;
    const { activities } = this.props.activity;
    const { users } = this.props.users;
    const actLoading = this.props.activity.loading;
    let researchData;
    let journalData;
    let dashboardItems;
    let activityItems;
    let researchDiv;
    let journalDiv;
    let graphsDiv;
    let activityDiv = "col-md-12 mb-4";
    let recactDiv;
    let summaryDiv;
    let graphDiv = "row";

    // Summary
    let collegeTot = 0;
    let courseTot = 0;
    let researchTot = 0;
    let journalTot = 0;
    let detailedAct = (
      <h5 className="card-title" style={{ textAlign: "center" }}>
        Recent Activities
      </h5>
    );

    let recentActivities = [];
    let name;

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
                {activity.title}{" "}
                {users.map(user => {
                  if (activity.by === user._id) {
                    name =
                      user.name.firstName +
                      " " +
                      user.name.middleName +
                      " " +
                      user.name.lastName;
                  }
                })}
                {activity.type == `User` ? "" : `by ${name}${(name = "")}`}
              </b>{" "}
              <Moment fromNow>{activity.date}</Moment>
            </p>
          )
        );

        detailedAct = (
          <h5 className="card-title" style={{ textAlign: "center" }}>
            Recent Activities | <Link to="/activities">Detailed List</Link>
          </h5>
        );

        activityItems = (
          <div style={{ overflow: "auto", height: "900px", fontSize: "13px" }}>
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
          div = "col-md-6";
          if (this.props.auth.isAuthenticated) {
            div = "col-md-12";
          }
          graphsDiv = "col-md-9 mb-4";
          activityDiv = "col-md-5 mb-4";

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

          div = "col-md-6";
          if (this.props.auth.isAuthenticated) {
            div = "col-md-12";
          }
          graphsDiv = "col-md-9 mb-4";
          activityDiv = "col-md-5 mb-4";

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
            <div className="col-md-3 mb-4">
              <div className="card shadow h-100 py-2">
                <div className="card-body pr-0">
                  {detailedAct}
                  {activityItems}
                </div>
              </div>
              <br />
            </div>
          );
        } else {
          graphDiv = "col-md-12";
          graphsDiv = "col-md-12 mb-4";
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
          researchTot += parseInt(college.researchTotal, 10);
          journalTot += parseInt(college.journalTotal, 10);
        });

        for (let index = 0; index < colleges.length; index++) {
          if (colleges[index].deleted === 0) {
            ++collegeTot;
          }
        }

        for (let index = 0; index < colleges.length; index++) {
          if (colleges[index].deleted === 0) {
            for (
              let index2 = 0;
              index2 < colleges[index].course.length;
              index2++
            ) {
              if (colleges[index].course[index2].status === 0) {
                if (colleges[index].course[index2].deleted === 0) {
                  ++courseTot;
                }
              }
            }
          }
        }
      } catch (error) {}
      dashboardItems = (
        <div className="row">
          <div className="col-12">
            <div className="row">
              {/* Colleges */}
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div
                          className="text-xs font-weight-bold text-uppercase mb-1"
                          style={{ color: "#2E86C1" }}
                        >
                          Colleges
                        </div>
                        <div className="h5 mb-0 font-weight-bold">
                          {collegeTot}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i
                          className="fas fa-university fa-2x"
                          style={{ color: "#5DADE2" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Courses */}
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div
                          className="text-xs font-weight-bold text-uppercase mb-1"
                          style={{ color: "#1E8449" }}
                        >
                          Courses
                        </div>
                        <div className="h5 mb-0 font-weight-bold">
                          {courseTot}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i
                          className="fas fa-graduation-cap fa-2x"
                          style={{ color: "#58D68D" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Researches */}
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-danger shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div
                          className="text-xs font-weight-bold text-uppercase mb-1"
                          style={{ color: "#BA4A00" }}
                        >
                          Researches
                        </div>
                        <div className="h5 mb-0 font-weight-bold">
                          {researchTot}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i
                          className="fas fa-book fa-2x"
                          style={{ color: "#E59866" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Journals */}
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div
                          className="text-xs font-weight-bold text-uppercase mb-1"
                          style={{ color: "#D4AC0D" }}
                        >
                          Journals
                        </div>
                        <div className="h5 mb-0 font-weight-bold">
                          {journalTot}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i
                          className="fas fa-book-open fa-2x"
                          style={{ color: "#F4D03F" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Graphs */}
            <div>
              <div className="row">
                <div className={graphsDiv}>
                  <div className="card shadow h-100 py-2">
                    <div className="row">
                      {researchDiv}
                      {journalDiv}
                    </div>
                  </div>
                </div>
                {recactDiv}
                {/* {summaryDiv} */}
              </div>
            </div>
          </div>
        </div>
      );
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
  getUsers: PropTypes.func.isRequired,
  getJournals: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  activity: state.activity,
  auth: state.auth,
  users: state.users
});

export default connect(
  mapStateToProps,
  {
    changePageTitle,
    getColleges,
    getActivities,
    getResearches,
    getUsers,
    getJournals
  }
)(Dashboard);
