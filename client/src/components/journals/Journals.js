import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";

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
    let researchItems;
    let researchData;
    let action;
    let title = <h1 className="display-4 text-center">Journal</h1>;
    let info = "See all journal and it's informations";

    if (journals === null || loading) {
      researchItems = <Spinner />;
    } else {
      if (journals.length > 0) {
        if (this.props.auth.isAuthenticated) {
          if (this.state.bin) {
            // Research Bin
            researchData = journals.map(research =>
              research.deleted === 1
                ? {
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
                  view: (
                    <Link
                      to={/journals/ + research._id}
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
                  view: null
                }
            );
            researchData.map((data, index) => {
              if (data.title === null) {
                researchData.splice(index, 1);
              }
            });

            title = (
              <h1 className="display-4 text-danger text-center">Journal Bin</h1>
            );
            info = "List of Removed Journals";
          } else {
            // Research List
            researchData = journals.map(research =>
              research.deleted === 0
                ? {
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
                  view: (
                    <Link
                      to={/journals/ + research._id}
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
                  view: null
                }
            );
            researchData.map((data, index) => {
              if (data.title === null) {
                researchData.splice(index, 1);
              }
            });

            title = <h1 className="display-4 text-center">Journal</h1>;
            info = "See all journal and it's informations";
          }
        } else {
          // Research List not logged in
          researchData = journals.map(research =>
            research.deleted === 0
              ? research.hidden === 0
                ? {
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
                  view: (
                    <Link
                      to={/journal/ + research._id}
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
                  view: null
                }
              : {
                title: null,
                college: null,
                course: null,
                status: null,
                view: null
              }
          );
          researchData.map((data, index) => {
            if (data.title === null) {
              researchData.splice(index, 1);
            }
          });

          title = <h1 className="display-4 text-center">Journal</h1>;
          info = "See all journal and it's informations";
        }

        for (let index = 0; index < researchData.length; index++) {
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
              { title: "Title", field: "title" },
              { title: "College", field: "college" },
              { title: "Course", field: "course" },
              { title: "Status", field: "status" },
              { title: "View Details", field: "view" }
            ]}
            options={{
              pageSizeOptions: [10, 20, 30, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 30
            }}
            data={researchData}
            title="Journals"
          />
        );
      } else {
        researchItems = <h4>No journal found</h4>;
      }

      if (this.props.auth.isAuthenticated) {
        action = <JournalAction />;
      }
    }

    return (
      <div className="researches">
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
            {researchItems}
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