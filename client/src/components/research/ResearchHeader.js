import React, { Component } from "react";

class ResearchHeader extends Component {
  render() {
    const { research } = this.props;
    let type;
    if (research.type === "thesis") {
      type = <span className="badge badge-success">Thesis</span>;
    } else {
      type = <span className="badge badge-info">Undergrad Research</span>;
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title display-4">{research.title}</h5>
          <span>
            <b>College:</b> {research.college}
          </span>
          <br />
          <span>
            <b>Course:</b> {research.course}
          </span>
          <br />
          <span>
            <b>Pages:</b> {research.pages}
          </span>
          <br />
          {type}
        </div>
      </div>
    );
  }
}

export default ResearchHeader;
