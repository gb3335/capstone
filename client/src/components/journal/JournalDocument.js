import React, { Component } from "react";

class ResearchDocument extends Component {
  render() {
    const { journal } = this.props;
    const docPath =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/journalDocuments/" +
      journal.document;
    let fileItems;

    if (journal.document) {
      fileItems = (
        <div style={{ height: "100vh" }}>
          <iframe src={docPath} height="100%" width="100%" />
        </div>
        // <div>
        //   <a href={docPath} target="_blank" rel="noopener noreferrer">
        //     View Document
        //   </a>
        // </div>
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

export default ResearchDocument;
