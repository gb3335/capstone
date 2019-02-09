import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import MaterialTable from "material-table";

import { getResearches } from "../../actions/researchActions";

import ResearchesActions from "./ResearchesActions";

class Researches extends Component {
  componentWillMount() {
    this.props.getResearches();
  }

  render() {
    const { researches, loading } = this.props.research;
    let researchItems;

    if (researches === null || loading) {
      researchItems = <Spinner />;
    } else {
      if (researches.length > 0) {
        const researchData = researches.map(research => ({
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
        }));

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
    }

    return (
      <div className="researches">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Researches</h1>
              <p className="lead text-center">
                See all research and it's informations
              </p>
              <ResearchesActions />
              {researchItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Researches.propTypes = {
  getResearches: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research
});

export default connect(
  mapStateToProps,
  { getResearches }
)(Researches);
