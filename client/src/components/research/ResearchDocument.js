import React, { Component } from "react";

class ResearchDocument extends Component {
  render() {
    const { research } = this.props;
    const docPath = "/documents/researchDocuments/" + research.document;
    let fileItems;

    if (research.document) {
      fileItems = (
        <div style={{ height: "100vh" }}>
          <iframe src={docPath} height="100%" width="100%" />
        </div>
        // <div>
        //   <a
        //     href={docPath}
        //     download="researchPdf"
        //     target="_blank"
        //     rel="noopener noreferrer"
        //   >
        //     View Document
        //   </a>
        // </div>
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

export default ResearchDocument;
