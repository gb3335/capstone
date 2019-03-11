import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

class ResearchHeader extends Component {
  render() {
    const { research } = this.props;
    let type;
    let deleted;
    if (research.type === "thesis") {
      type = <span className="badge badge-success">Thesis</span>;
    } else {
      type = <span className="badge badge-info">Undergrad Research</span>;
    }

    if (research.deleted === 1) {
      deleted = <span className="badge badge-danger">Deleted</span>;
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
            <b>Research ID:</b> {research.researchID}
          </span>
          <br />
          <span>
            <b>Pages:</b> {research.pages}
          </span>
          <br />
          <span>
            <b>School Year:</b> {research.schoolYear}
          </span>
          <br />
          <span>
            <b>Updated:</b>{" "}
            <Moment format="MMM. DD, YYYY">{research.lastUpdate}</Moment>
            {" at "}
            <Moment format="h:mm A">{research.lastUpdate}</Moment>
          </span>
          <br />
          {type}
          <br />
          {deleted}
        </div>
      </div>
    );
  }
}

export default ResearchHeader;
