import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import moment from "moment";

import "./Researches.css";

import { getResearches } from "../../actions/researchActions";

import ResearchesActions from "./ResearchesActions";

class Researches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };
  }

  componentWillMount() {
    this.props.getResearches();
  }

  componentDidMount() {
    this.props.getResearches();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  render() {
    const { researches, loading } = this.props.research;
    let researchItems;
    let researchData;
    let action;
    let title = <h1 className="display-4 text-center">Researches</h1>;
    let info = "See all research and it's informations";

    if (researches === null || loading) {
      researchItems = <Spinner />;
    } else {
      if (researches.length > 0) {
        if (this.props.auth.isAuthenticated) {
          if (this.state.bin) {
            // Research Bin
            let ctr = 1;

            researchData = researches.map(research =>
              research.deleted === 1
                ? {
                    no: ctr++,
                    title:
                      research.title.length > 30
                        ? research.title.substring(0, 27) + "..."
                        : research.title,
                    college: research.college,
                    course: research.course,
                    status:
                      research.deleted === 0
                        ? research.hidden === 0
                          ? "Active"
                          : "Hidden"
                        : "Deleted",
                    updated:
                      research.lastUpdate +
                      moment(research.lastUpdate).format(
                        "MMMM Do YYYY, h:mm A"
                      ),
                    view: (
                      <Link
                        to={/researches/ + research._id}
                        className="btn btn-outline-danger btn-sm"
                      >
                        View Details
                      </Link>
                    )
                  }
                : {
                    no: null,
                    title: null,
                    college: null,
                    course: null,
                    status: null,
                    updated: null,
                    view: null
                  }
            );
            researchData.map((data, index) => {
              if (data.title === null) {
                researchData.splice(index, 1);
              }
            });

            title = (
              <h1 className="display-4 text-danger text-center">
                Research Bin
              </h1>
            );
            info = "List of Removed Researches";
          } else {
            // Research List
            let ctr = 1;

            researchData = researches.map(research =>
              research.deleted === 0
                ? {
                    no: ctr++,
                    title:
                      research.title.length > 30
                        ? research.title.substring(0, 27) + "..."
                        : research.title,
                    college: research.college,
                    course: research.course,
                    status:
                      research.deleted === 0
                        ? research.hidden === 0
                          ? "Active"
                          : "Hidden"
                        : "Deleted",
                    updated:
                      research.lastUpdate +
                      moment(research.lastUpdate).format(
                        "MMMM Do YYYY, h:mm A"
                      ),
                    view: (
                      <Link
                        to={/researches/ + research._id}
                        className="btn btn-outline-info btn-sm"
                      >
                        View Details
                      </Link>
                    )
                  }
                : {
                    no: null,
                    title: null,
                    college: null,
                    course: null,
                    status: null,
                    updated: null,
                    view: null
                  }
            );
            researchData.map((data, index) => {
              if (data.title === null) {
                researchData.splice(index, 1);
              }
            });

            title = <h1 className="display-4 text-center">Researches</h1>;
            info = "See all research and it's informations";
          }
        } else {
          // Research List not logged in
          let ctr = 1;

          researchData = researches.map(research =>
            research.deleted === 0
              ? research.hidden === 0
                ? {
                    no: ctr++,
                    title:
                      research.title.length > 30
                        ? research.title.substring(0, 27) + "..."
                        : research.title,
                    college: research.college,
                    course: research.course,
                    status:
                      research.deleted === 0
                        ? research.hidden === 0
                          ? "Active"
                          : "Hidden"
                        : "Deleted",
                    updated:
                      research.lastUpdate +
                      moment(research.lastUpdate).format(
                        "MMMM Do YYYY, h:mm A"
                      ),
                    view: (
                      <Link
                        to={/researches/ + research._id}
                        className="btn btn-outline-info btn-sm"
                      >
                        View Details
                      </Link>
                    )
                  }
                : {
                    no: null,
                    title: null,
                    college: null,
                    course: null,
                    status: null,
                    updated: null,
                    view: null
                  }
              : {
                  no: null,
                  title: null,
                  college: null,
                  course: null,
                  status: null,
                  updated: null,
                  view: null
                }
          );
          researchData.map((data, index) => {
            if (data.title === null) {
              researchData.splice(index, 1);
            }
          });

          title = <h1 className="display-4 text-center">Researches</h1>;
          info = "See all research and it's informations";
        }

        for (
          let index = 0;
          index < researchData.length * researchData.length;
          index++
        ) {
          researchData.map((data, index) => {
            if (data.title === null) {
              researchData.splice(index, 1);
            }
          });

          researchData.map((data, i, arr) => {
            if (arr.length - 1 === i) {
              if (data.title === null) {
                researchData.splice(i, 1);
              }
            } else {
              // not last one
            }
          });
        }

        researchItems = (
          <MaterialTable
            columns={[
              { title: "#", field: "no" },
              { title: "Title", field: "title" },
              { title: "College", field: "college" },
              { title: "Course", field: "course" },
              { title: "Status", field: "status" },
              {
                title: "Updated on",
                field: "updated",
                render: rowData => {
                  try {
                    const date = moment(rowData.updated.substr(0, 24)).format(
                      "MMMM Do YYYY, h:mm A"
                    );
                    return date;
                  } catch (error) {}
                }
              },
              { title: "View Details", field: "view" }
            ]}
            options={{
              pageSizeOptions: [10, 20, 30, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 30
            }}
            data={researchData}
            title="Researches"
          />
        );
      } else {
        researchItems = <h4>No research found</h4>;
      }

      if (this.props.auth.isAuthenticated) {
        action = <ResearchesActions />;
      }
    }

    return (
      <div className="researches">
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <div className="researchesBg">
              <div className="light-overlay">
                {title}
                <p className="lead text-center">{info}</p>
              </div>
            </div>
            <br />
            {action}
            <div className="tableClassname">{researchItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

Researches.propTypes = {
  getResearches: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  bin: state.research.bin,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getResearches }
)(Researches);
