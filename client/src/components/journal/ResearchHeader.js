import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

class ResearchHeader extends Component {
  render() {
    const { research } = this.props;

    let deleted;
    let hidden;


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
            <b>College:</b> {research.college}
          </span>
          <br />
          <span>
            <b>Course:</b> {research.course}
          </span>
          <br />
          <span>
            <b>ISSN :</b> {research.issn}
          </span>
          <br />
          <span>
            <b>Publisher :</b> {research.publisher}
          </span>
          <br />
          <span>
            <b>Volume :</b> {research.volume}
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

          {deleted} {hidden}
        </div>
      </div>
    );
  }
}

export default ResearchHeader;
