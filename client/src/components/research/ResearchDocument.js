import React, { Component } from "react";
//import logger from "logging-library";
import FileViewer from "react-file-viewer";
//import { CustomErrorComponent } from "custom-error";

class ResearchDocument extends Component {
  render() {
    const { research } = this.props;

    const file = "/documents/researchDocuments/qwe.docx";
    const type = "docx";

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Document</h5>

          {/* <FileViewer
            fileType={type}
            filePath={file}
            //errorComponent={CustomErrorComponent}
            onError={this.onError}
          /> */}
        </div>
      </div>
    );
  }
}

export default ResearchDocument;
