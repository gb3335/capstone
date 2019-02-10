import React, { Component } from "react";
import FileViewer from "react-file-viewer";

class ResearchDocument extends Component {
  render() {
    const { research } = this.props;
    let fileItems;
    const file = "/documents/researchDocuments/" + research.document;
    const type = "docx";

    if (research.document) {
      fileItems = (
        <FileViewer fileType={type} filePath={file} onError={this.onError} />
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
