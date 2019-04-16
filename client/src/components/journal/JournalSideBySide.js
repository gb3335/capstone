import React, { Component } from 'react'
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { onSideBySide } from "../../actions/journalActions";
import { journalPlagiarismLocal } from "../../actions/localPlagiarismActions";


class JournalSideBySide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };

    this.setSideBySideFalse = this.setSideBySideFalse.bind(this);
    this.onSelect = this.onSelect.bind(this);

  }

  setSideBySideFalse() {
    console.log("side")
    this.props.onSideBySide(false);
  }

  onSelect(journal) {
    let newJournal = []
    newJournal.push(journal)
    const input = {
      docuId: this.props.journal.journal._id,
      title: this.props.journal.journal.title,
      docuFile: this.props.journal.journal.document,
      journals: newJournal,
      flag: true,
      fromFlag: true
    };
    this.props.onSideBySide(false);
    this.props.journalPlagiarismLocal(input, this.props.history);

  }

  render() {
    const { journals, loading, journal } = this.props.journal;
    let journalItems;
    let journalData;
    let action;
    let title = <h1 className="display-4 text-center">Journals</h1>;
    let info = "See all journal and it's informations";


    for (let x = 0; x < journals.length; x++) {
      if (journal.title === journals[x].title) {
        journals.splice(x, 1);
        break;
      }
    }

    for (let x = 0; x < journals.length; x++) {
      if (!journals[x].document) {
        journals.splice(x, 1);
      }
    }

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
                  view: (
                    <button
                      onClick={() => this.onSelect(journal)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Select
                      </button>
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
            info = "List of Removed Researches";
          } else {
            // Journal List
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
                  view: (
                    <button
                      onClick={() => this.onSelect(journal)}
                      className="btn btn-outline-info btn-sm"
                    >
                      Select
                      </button>
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
            journalData.map((data, index) => {
              if (data.title === null) {
                journalData.splice(index, 1);
              }
            });

            title = <h1 className="display-4 text-center">Researches</h1>;
            info = "See all journal and it's informations";
          }
        } else {
          // Journal List not logged in
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
                  view: (
                    <button
                      onClick={() => this.onSelect(journal)}
                      className="btn btn-outline-info btn-sm"
                    >
                      Select
                      </button>
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
          journalData.map((data, index) => {
            if (data.title === null) {
              journalData.splice(index, 1);
            }
          });

          title = <h1 className="display-4 text-center">Researches</h1>;
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
              { title: "", field: "view" }
            ]}
            options={{
              pageSizeOptions: [10, 15, 25, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 15
            }}
            data={journalData}
            title={`Select a Journal to compare with ${journal.title}`}
          />
        );
      } else {
        journalItems = <h4>No journal found</h4>;
      }

    }



    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <button
              className="btn btn-light mb-3 float-left"
              onClick={this.setSideBySideFalse}
            >
              <i className="fas fa-angle-left" /> Back
                </button>
          </div>
        </div>
        <div className="tableClassname">
          {journalItems}
        </div>
        
      </div>
    )
  }
}

JournalSideBySide.propTypes = {
  journal: PropTypes.object.isRequired,
  onSideBySide: PropTypes.func.isRequired,
  journalPlagiarismLocal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  journal: state.journal,
  bin: state.journal.bin,
  auth: state.auth
});

export default connect(mapStateToProps, { onSideBySide, journalPlagiarismLocal })(withRouter(JournalSideBySide))
