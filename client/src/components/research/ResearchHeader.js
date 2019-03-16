import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

class ResearchHeader extends Component {
  render() {
    const { research } = this.props;
    let type;
    let deleted;
    let hidden;
    if (research.type === "thesis") {
      type = "Thesis";
    } else {
      type = "Undergrad Research";
    }

    if (research.deleted === 1) {
      deleted = <span className="badge badge-danger">Deleted</span>;
    }
    if (research.hidden === 1) {
      hidden = <span className="badge badge-warning">Hidden</span>;
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title display-4">{research.title}</h5>
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>College:</b> {research.college}
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Course:</b> {research.course}
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Research ID:</b> {research.researchID}
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Pages:</b> {research.pages}
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Academic Year:</b> {research.schoolYear}
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Created:</b>{" "}
            <Moment format="MMM. DD, YYYY">{research.dateCreated}</Moment>
            {" at "}
            <Moment format="h:mm A">{research.dateCreated}</Moment>
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Updated:</b>{" "}
            <Moment format="MMM. DD, YYYY">{research.lastUpdate}</Moment>
            {" at "}
            <Moment format="h:mm A">{research.lastUpdate}</Moment>
          </span>
          <br />
          <span>
            <i className="fas fa-caret-right mr-1" />
            <b>Type:</b> {type}
          </span>
          <br />
          {deleted} {hidden}
        </div>
      </div>
    );
  }
}

export default ResearchHeader;
