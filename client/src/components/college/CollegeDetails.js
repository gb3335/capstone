import React, { Component } from "react";

class CollegeDetails extends Component {
  render() {
    const { college } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">Information</h3>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <p className="lead">
                  <i className="fas fa-book-reader" />{" "}
                  <span>Librarian: {college.librarian}</span>
                </p>
                <p className="lead">
                  <i className="fas fa-university" />{" "}
                  <span>Total Courses: {college.courseTotal}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="lead">
                  <i className="fas fa-book" />{" "}
                  <span>Total Researches: {college.researchTotal}</span>
                </p>
                <p className="lead">
                  <i className="fas fa-newspaper" />{" "}
                  <span>Total Journals: {college.journalTotal}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollegeDetails;
