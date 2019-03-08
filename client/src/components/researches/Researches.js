import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";

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
            researchData = researches.map(research =>
              research.deleted === 1
                ? {
                    title:
                      research.title.length > 30
                        ? research.title.substring(0, 27) + "..."
                        : research.title,
                    college: research.college,
                    course: research.course,
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
                    title: null,
                    college: null,
                    course: null,
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
                    title: null,
                    college: null,
                    course: null,
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
              ? {
                  title:
                    research.title.length > 30
                      ? research.title.substring(0, 27) + "..."
                      : research.title,
                  college: research.college,
                  course: research.course,
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
                  title: null,
                  college: null,
                  course: null,
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

        researchData.map((data, index) => {
          if (data.title === null) {
            researchData.splice(index, 1);
          }
        });

        researchData.map((data, index) => {
          if (data.title === null) {
            researchData.splice(index, 1);
          }
        });

        researchItems = (
          <MaterialTable
            columns={[
              { title: "Title", field: "title" },
              { title: "College", field: "college" },
              { title: "Course", field: "course" },
              { title: "View Details", field: "view" }
            ]}
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
            {title}
            <p className="lead text-center">{info}</p>
            {action}
            {researchItems}
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
