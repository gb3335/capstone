import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";

import "./College.css";

class CollegeDetails extends Component {
  render() {
    const { college } = this.props;
    let activeCourseLenght = 0;

    college.course.map(cou => {
      if (cou.status === 0 && cou.deleted === 0) {
        activeCourseLenght++;
      }
    });

    const status =
      college.status === 0 ? (
        <span className="badge badge-success">Active</span>
      ) : (
        <span className="badge badge-danger">Not Active</span>
      );

    const deleted =
      college.deleted === 1 ? (
        <span className="badge badge-danger">Deleted</span>
      ) : (
        // not status, just indicate that its not deleted
        <span className="badge badge-success">Active</span>
      );

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
                  <span>Total Courses: {activeCourseLenght}</span>
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
                  <span>Status: {deleted}</span>
                </p>
                <p className="infoText">
                  <i className="fas fa-redo-alt" />{" "}
                  <span>
                    Updated:{" "}
                    <Moment format="MMM. DD, YYYY">
                      {college.lastUpdate.date}
                    </Moment>
                    {" at "}
                    <Moment format="h:mm A">{college.lastUpdate.date}</Moment>
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
