import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class CollegeItem extends Component {
  render() {
    const path = "/images/collegeLogos/";
    const { college } = this.props;
    let colStatus;
    if (college.status === 0) {
      colStatus = <span className="badge badge-success">Active</span>;
    } else {
      colStatus = <span className="badge badge-danger">Not Active</span>;
    }

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img
              src={path + college.logo}
              alt="Logo"
              className="rounded-circle"
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{college.name.fullName}</h3>
            <p>{colStatus} </p>
            <Link
              to={`/colleges/${college.name.initials}`}
              className="btn btn-info"
            >
              View Details
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h4>Documents</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <i className="fas fa-book pr-1" />
                Research Total: {college.researchTotal}
              </li>
              <li className="list-group-item">
                <i className="fas fa-journal-whills pr-1" />
                Journal Total: {college.journalTotal}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

CollegeItem.propTypes = {
  college: PropTypes.object.isRequired
};

export default CollegeItem;
