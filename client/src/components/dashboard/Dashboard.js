import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import "./Dashboard.css";

import Spinner from "../common/Spinner";
import DoughnutChart from "../common/DoughnutChart";

import { getColleges } from "../../actions/collegeActions";
import { changePageTitle } from "../../actions/sidebarActions";

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
    const products = [
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      },
      {
        title: "College Added",
        date: "Aug. 23, 1998"
      },
      {
        title: "Research Added",
        date: "Feb. 12, 1392"
      },
      {
        title: "College Edited",
        date: "Dec. 34, 1829"
      }
    ];

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
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" style={{ textAlign: "center" }}>
                  Total Researches
                </h5>
                <DoughnutChart data={researchData} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" style={{ textAlign: "center" }}>
                  Total Researches
                </h5>
                <DoughnutChart data={journalData} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" style={{ textAlign: "center" }}>
                  Recent Activities
                </h5>
                <BootstrapTable data={products} pagination>
                  <TableHeaderColumn dataField="title" isKey>
                    Activity
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="date">Time</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid">
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
