import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

class ResearchAction extends Component {
  render() {
    const deleted = this.props.research.research.deleted;
    let editAction;

    if (deleted === 0) {
      editAction = (
        <Link to="/edit-research" className="btn btn-light">
          <i className="fas fa-pen text-info mr-1" /> Edit Research
        </Link>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        {editAction}
      </div>
    );
  }
}

ResearchAction.propTypes = {
  research: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  research: state.research,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(ResearchAction));
