import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { downloadResearchDoc } from "../../actions/researchActions";

class ResearchDocument extends Component {
  onView = () => {
    const resData = {
      title: this.props.research.title,
      document: this.props.research.document
    };

    this.props.downloadResearchDoc(resData);
  };

  render() {
    const { research } = this.props;
    const docPath = "/documents/researchDocuments/" + research.document;
    let fileItems;

    if (research.document) {
      fileItems = (
        // <div style={{ height: "100vh" }}>
        //   <iframe src={docPath} height="100%" width="100%" />
        // </div>
        <div>
          {/* <a
            href={docPath}
            download="researchPdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Document
          </a> */}
          <Link to="#" onClick={this.onView} className="btn btn-info">
            <i className="fab fa-readme mr-2" />
            View Document
          </Link>
        </div>
      );
    } else {
      fileItems = <span>No document is added for this research</span>;
    }

    return (
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-1info">Document</h5>
          <hr />
          {fileItems}
        </div>
      </div>
    );
  }
}

ResearchDocument.propTypes = {
  downloadResearchDoc: PropTypes.func.isRequired
};

export default connect(
  null,
  { downloadResearchDoc }
)(ResearchDocument);
