import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

class JournalHeader extends Component {
  render() {
    const { journal } = this.props;

    let deleted;
    let hidden;


    if (journal.deleted === 1) {
      deleted = <span className="badge badge-danger">Deleted</span>;
    }
    if (journal.hidden === 1) {
      hidden = <span className="badge badge-warning">Hidden</span>;
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title display-4">{journal.title}</h5>
          <span>
            <b>College:</b> {journal.college}
          </span>
          <br />
          <span>
            <b>Course:</b> {journal.course}
          </span>
          <br />
          <span>
            <b>ISSN :</b> {journal.issn}
          </span>
          <br />
          <span>
            <b>Publisher :</b> {journal.publisher}
          </span>
          <br />
          <span>
            <b>Volume :</b> {journal.volume}
          </span>
          <br />
          <span>
            <b>Pages:</b> {journal.pages}
          </span>
          <br />
          <span>
            <b>Year Published:</b> {journal.yearPublished}
          </span>
          <br />
          <span>
            <b>Updated:</b>{" "}
            <Moment format="MMM. DD, YYYY">{journal.lastUpdate}</Moment>
            {" at "}
            <Moment format="h:mm A">{journal.lastUpdate}</Moment>
          </span>

          {deleted} {hidden}
        </div>
      </div>
    );
  }
}

export default JournalHeader;
