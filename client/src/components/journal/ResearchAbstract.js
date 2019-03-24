import React, { Component } from "react";
import renderHTML from "react-render-html";

class ResearchAbstract extends Component {
  render() {
    const { research } = this.props;
    let abstract = "";

    try {
      if (research.description == "" || research.description == null) {
        abstract = <div>No description</div>

      }
      else {
        abstract = renderHTML(research.description);
      }
    } catch (err) {
      console.log(err);
    }
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Description</h5>
          <hr />
          {abstract}
        </div>
      </div>
    );
  }
}

export default ResearchAbstract;
