import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import moment from "moment";

import "./Journals.css";

import { getJournals } from "../../actions/journalActions";

import JournalAction from "./JournalAction";

class Journals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };
  }

  componentWillMount() {
    this.props.getJournals();
  }

  componentDidMount() {
    this.props.getJournals();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  render() {
    const { journals, loading } = this.props.journal;
    let journalItems;
    let journalData;
    let action;
    let title = <h1 className="display-4 text-center">Journals</h1>;
    let info = "See all journal and it's informations";

    if (journals === null || loading) {
      journalItems = <Spinner />;
    } else {
      if (journals.length > 0) {
        if (this.props.auth.isAuthenticated) {
          if (this.state.bin) {
            // Journal Bin
            journalData = journals.map(journal =>
              journal.deleted === 1
                ? {
                  title:
                    journal.title.length > 30
                      ? journal.title.substring(0, 27) + "..."
                      : journal.title,
                  college: journal.college,
                  course: journal.course,
                  status:
                    journal.deleted === 0
                      ? journal.hidden === 0
                        ? "Active"
                        : "Hidden"
                      : "Deleted",
                  updated:
                    journal.lastUpdate +
                    moment(journal.lastUpdate).format(
                      "MMMM Do YYYY, h:mm A"
                    ),
                  view: (
                    <Link
                      to={/journals/ + journal._id}
                      className="btn btn-outline-danger btn-sm"
                    >
                      View Details
                      </Link>
                  )
                }
                : {
                  title: null,
                  college: null,
                  course: null,
                  status: null,
                  updated: null,
                  view: null
                }
            );
            journalData.map((data, index) => {
              if (data.title === null) {
                journalData.splice(index, 1);
              }
            });

            title = (
              <h1 className="display-4 text-danger text-center">
                Journal Bin
              </h1>
            );
            info = "List of Removed Journals";
          } else {
            // Journal list
            journalData = journals.map(journal =>
              journal.deleted === 0
                ? {
                  title:
                    journal.title.length > 30
                      ? journal.title.substring(0, 27) + "..."
                      : journal.title,
                  college: journal.college,
                  course: journal.course,
                  status:
                    journal.deleted === 0
                      ? journal.hidden === 0
                        ? "Active"
                        : "Hidden"
                      : "Deleted",
                  updated:
                    journal.lastUpdate +
                    moment(journal.lastUpdate).format(
                      "MMMM Do YYYY, h:mm A"
                    ),
                  view: (
                    <Link
                      to={/journals/ + journal._id}
                      className="btn btn-outline-info btn-sm"
                    >
                      View Details
                      </Link>
                  )
                }
                : {
                  title: null,
                  college: null,
                  course: null,
                  status: null,
                  updated: null,
                  view: null
                }
            );
            journalData.map((data, index) => {
              if (data.title === null) {
                journalData.splice(index, 1);
              }
            });


            title = <h1 className="display-4 text-center">Journals</h1>;
            info = "See all journal and it's informations";
          }
          journalData.map((data, index) => {
            if (data.title === null) {
              journalData.splice(index, 1);
            }
          });
        } else {
          // Journal list not logged in
          journalData = journals.map(journal =>
            journal.deleted === 0
              ? journal.hidden === 0
                ? {
                  title:
                    journal.title.length > 30
                      ? journal.title.substring(0, 27) + "..."
                      : journal.title,
                  college: journal.college,
                  course: journal.course,
                  status:
                    journal.deleted === 0
                      ? journal.hidden === 0
                        ? "Active"
                        : "Hidden"
                      : "Deleted",
                  updated:
                    journal.lastUpdate +
                    moment(journal.lastUpdate).format(
                      "MMMM Do YYYY, h:mm A"
                    ),
                  view: (
                    <Link
                      to={/journals/ + journal._id}
                      className="btn btn-outline-info btn-sm"
                    >
                      View Details
                      </Link>
                  )
                }
                : {
                  title: null,
                  college: null,
                  course: null,
                  status: null,
                  updated: null,
                  view: null
                }
              : {
                title: null,
                college: null,
                course: null,
                status: null,
                updated: null,
                view: null
              }
          );
          journalData.map((data, index) => {
            if (data.title === null) {
              journalData.splice(index, 1);
            }
          });

          title = <h1 className="display-4 text-center">Journals</h1>;
          info = "See all journal and it's informations";
        }


        for (let index = 0; index < journalData.length; index++) {
          journalData.map((data, index) => {
            if (data.title === null) {
              journalData.splice(index, 1);
            }
          });

          journalData.map((data, i, arr) => {
            if (arr.length - 1 === i) {
              if (data.title === null) {
                journalData.splice(i, 1);
              }
            } else {
              // not last one
            }
          });
        }



        journalItems = (
          <MaterialTable
            columns={[
              { title: "Title", field: "title" },
              { title: "College", field: "college" },
              { title: "Course", field: "course" },
              { title: "Status", field: "status" },
              {
                title: "Updated on",
                field: "updated",
                render: rowData => {
                  const date = moment(rowData.updated.substr(0, 24)).format(
                    "MMMM Do YYYY, h:mm A"
                  );
                  return date;
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
            data={journalData}
            title="Journals"
          />
        );
      } else {
        journalItems = <h4>No journal found</h4>;
      }

      if (this.props.auth.isAuthenticated) {
        action = <JournalAction />;
      }
    }

    return (
      <div className="journals">
        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12" style={{ overflow: "auto" }}>
            <div className="journalBg">
              <div className="light-overlay">
                {title}
                <p className="lead text-center">{info}</p>
              </div>
            </div>
            <br />
            {action}
            {journalItems}
          </div>
        </div>
      </div>
    );
  }
}

Journals.propTypes = {
  getJournals: PropTypes.func.isRequired,
  journal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  journal: state.journal,
  bin: state.journal.bin,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getJournals }
)(Journals);
