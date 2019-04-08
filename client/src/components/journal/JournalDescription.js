import React, { Component } from "react";
import renderHTML from "react-render-html";

class JournalDescription extends Component {
  render() {
    const { journal } = this.props;
    let abstract = "";

    try {
      if (journal.description == "" || journal.description == null) {
        abstract = <div>No description</div>;
      } else {
        abstract = renderHTML(journal.description);
      }
    } catch (err) {
      console.log(err);
    }
    return (
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-info">Description</h5>
          <hr />
          {abstract}
        </div>
      </div>
    );
  }
}

export default JournalDescription;
