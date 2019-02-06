import React, { Component } from "react";

class ResearchAuthors extends Component {
  render() {
    const { research } = this.props;

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Authors</h5>
        </div>
      </div>
    );
  }
}

export default ResearchAuthors;
