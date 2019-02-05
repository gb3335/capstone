import React, { Component } from "react";

class ResearchHeader extends Component {
  render() {
    const { research } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <h3>{research.title}</h3>
          <hr />
          <p style={{ textIndent: "1em" }}>{research.abstract}</p>
        </div>
      </div>
    );
  }
}

export default ResearchHeader;
