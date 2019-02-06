import React, { Component } from "react";

class ResearchAbstract extends Component {
  render() {
    const { research } = this.props;

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Abstract</h5>
          <p className="card-text">{research.abstract}</p>
        </div>
      </div>
    );
  }
}

export default ResearchAbstract;
