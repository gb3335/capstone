import React, { Component } from 'react'
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { onSideBySide } from "../../actions/researchActions";
import { checkPlagiarismLocal } from "../../actions/localPlagiarismActions";


class ResearchSideBySide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };

    this.setSideBySideFalse = this.setSideBySideFalse.bind(this);
    this.onSelect = this.onSelect.bind(this);

  }

  setSideBySideFalse() {
    const input = {
      fromFlag: false,
      abstract: false
    }
    this.props.onSideBySide(input);
  }

  onSelect(research) {
    let newresearch = []
    newresearch.push(research)
    const input = {
      docuId: this.props.research.research._id,
      title: this.props.research.research.title,
      docuFile: this.props.research.research.document,
      researches: newresearch,
      flag: true,
      fromFlag: true,
      abstract: this.props.research.abstract
    };

    const input2 = {
      fromFlag: false,
      abstract: this.props.research.abstract
    }
    this.props.onSideBySide(input2);

    this.props.checkPlagiarismLocal(input, this.props.history);

  }

  render() {
    const { researches, loading, research } = this.props.research;
    let researchItems;
    let researchData;
    let action;
    let title = <h1 className="display-4 text-center">Researches</h1>;
    let info = "See all research and it's informations";


    for (let x = 0; x < researches.length; x++) {
      if (research.title === researches[x].title) {
        researches.splice(x, 1);
        break;
      }
    }

    for (let x = 0; x < researches.length; x++) {
      if (!researches[x].document) {
        researches.splice(x, 1);
      }
    }

    if (researches === null || loading) {
      researchItems = <Spinner />;
    } else {
      if (researches.length > 0) {
        if (this.props.auth.isAuthenticated) {
          if (this.state.bin) {
            // Research Bin
            researchData = researches.map(research =>
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
                    <button
                      onClick={() => this.onSelect(research)}
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
            researchData = researches.map(research =>
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
                    <button
                      onClick={() => this.onSelect(research)}
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
          researchData = researches.map(research =>
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
                    <button
                      onClick={() => this.onSelect(research)}
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
          researchData.map((data, index) => {
            if (data.title === null) {
              researchData.splice(index, 1);
            }
          });

          title = <h1 className="display-4 text-center">Researches</h1>;
          info = "See all research and it's informations";
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
              { title: "", field: "view" }
            ]}
            options={{
              pageSizeOptions: [10, 15, 25, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 15
            }}
            data={researchData}
            title={`Select a Research to compare with ${research.title}`}
          />
        );
      } else {
        researchItems = <h4>No research found</h4>;
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
        {researchItems}
      </div>
    )
  }
}

ResearchSideBySide.propTypes = {
  research: PropTypes.object.isRequired,
  onSideBySide: PropTypes.func.isRequired,
  checkPlagiarismLocal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  bin: state.research.bin,
  auth: state.auth
});

export default connect(mapStateToProps, { onSideBySide, checkPlagiarismLocal })(withRouter(ResearchSideBySide))
