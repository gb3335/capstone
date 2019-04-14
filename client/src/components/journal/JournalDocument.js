import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { downloadJournalDoc } from "../../actions/journalActions";

class ResearchDocument extends Component {
  onView = () => {
    const resData = {
      title: this.props.journal.title,
      document: this.props.journal.document
    };

    this.props.downloadJournalDoc(resData);
  };

  render() {
    const { journal } = this.props;
    const docPath = "/documents/journalDocuments/" + journal.document;
    let fileItems;

    if (journal.document) {
      fileItems = (
        // <div style={{ height: "100vh" }}>
        //   <iframe src={docPath} height="100%" width="100%" />
        // </div>
        <div>
          {/* <a href={docPath} target="_blank" rel="noopener noreferrer">
            View Document
          </a> */}
          <Link to="#" onClick={this.onView} className="btn btn-info">
            <i className="fab fa-readme mr-2" />
            View Document
          </Link>
        </div>
      );
    } else {
      fileItems = <span>No document is added for this journal</span>;
    }

    return (
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-info">Document</h5>
          <hr />
          {fileItems}
        </div>
      </div>
    );
  }
}
ResearchDocument.propTypes = {
  downloadJournalDoc: PropTypes.func.isRequired
};

export default connect(
  null,
  { downloadJournalDoc }
)(ResearchDocument);
