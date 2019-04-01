import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

class JournalAction extends Component {
  render() {
    const deleted = this.props.journal.journal.deleted;
    let editAction;

    if (deleted === 0) {
      editAction = (
        <Link to="/edit-journal" className="btn btn-light">
          <i className="fas fa-pen text-info mr-1" /> Edit Journal
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

JournalAction.propTypes = {
  journal: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  journal: state.journal,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(JournalAction));
