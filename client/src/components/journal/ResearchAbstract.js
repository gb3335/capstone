import React, { Component } from "react";
import renderHTML from "react-render-html";

class ResearchAbstract extends Component {
  render() {
    const { research } = this.props;
    let abstract = "";

    try {
      abstract = renderHTML(research.abstract);
    } catch (err) {
      console.log(err);
    }
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Abstract</h5>
          <hr />
          {abstract}
        </div>
      </div>
    );
  }
}

export default ResearchAbstract;
