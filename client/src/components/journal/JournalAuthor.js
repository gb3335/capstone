import React, { Component } from "react";
import Authors from "./Authors";

class JournalAuthor extends Component {
  render() {
    const { journal } = this.props;
    let authorItems;

    try {
      if (Object.keys(journal.author).length > 0) {
        authorItems = <Authors author={journal.author} />;
      } else {
        authorItems = (
          <div>
            <hr />
            <p>
              <span>No author is added in this journal</span>
            </p>
          </div>
        );
      }
    } catch (error) { }
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Authors</h5>
          {authorItems}
        </div>
      </div>
    );
  }
}

export default JournalAuthor;
