import React, { Component } from "react";
import renderHTML from "react-render-html";

class ResearchAbstract extends Component {
  render() {
    const { research } = this.props;

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Abstract</h5>
          <hr />
          {renderHTML(research.abstract)}
        </div>
      </div>
    );
  }
}

export default ResearchAbstract;
