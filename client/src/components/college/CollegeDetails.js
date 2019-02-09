import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

import "./College.css";

class CollegeDetails extends Component {
  render() {
    const { college } = this.props;
    const status = college.status === 0 ? "Active" : "Not Active";

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">Information</h3>
            <hr />
            <div className="row">
              <div className="col-md-4">
                <p className="infoText ">
                  <i className="fas fa-book-reader" />{" "}
                  <span>Librarian: {college.librarian}</span>
                </p>
                <p className="infoText">
                  <i className="fas fa-university" />{" "}
                  <span>Total Courses: {college.course.length}</span>
                </p>
              </div>
              <div className="col-md-4">
                <p className="infoText">
                  <i className="fas fa-book" />{" "}
                  <span>Total Researches: {college.researchTotal}</span>
                </p>
                <p className="infoText">
                  <i className="fas fa-newspaper" />{" "}
                  <span>Total Journals: {college.journalTotal}</span>
                </p>
              </div>
              <div className="col md-4">
                <p className="infoText">
                  <i className="fas fa-check-circle" />{" "}
                  <span>Status: {status}</span>
                </p>
                <p className="infoText">
                  <i className="fas fa-redo-alt" />{" "}
                  <span>
                    Last Update:{" "}
                    <Moment format="MMM. DD, YYYY">
                      {college.lastUpdate.date}
                    </Moment>
                  </span>
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
