import React, { Component } from "react";

class ResearchDocument extends Component {
  render() {
    const { research } = this.props;
    const docPath = "/documents/researchDocuments/" + research.document;
    let fileItems;

    if (research.document) {
      fileItems = (
        <a href={docPath} target="_blank">
          View Document
        </a>
      );
    } else {
      fileItems = <span>No document is added for this research</span>;
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Document</h5>
          {fileItems}
        </div>
      </div>
    );
  }
}

export default ResearchDocument;
