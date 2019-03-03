import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { deleteResearch } from "../../actions/researchActions";

class ResearchAction extends Component {
  onDeleteResearch = e => {
    e.preventDefault();

    const data = {
      id: this.props.research.research._id
    };

    this.props.deleteResearch(data, this.props.history);
  };

  render() {
    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <Link to="/edit-research" className="btn btn-light">
          <i className="fas fa-pen text-info mr-1" /> Edit Research
        </Link>

        <Link to="#" onClick={this.onDeleteResearch} className="btn btn-danger">
          <i className="fas fa-trash text-light mr-1" />
          Move to Bin
        </Link>
      </div>
    );
  }
}

ResearchAction.propTypes = {
  deleteResearch: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  research: state.research,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { deleteResearch }
)(withRouter(ResearchAction));
