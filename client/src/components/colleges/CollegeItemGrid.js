import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./Colleges.css";

class CollegeItemGrid extends Component {
  render() {
    const path =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/";
    const { college } = this.props;
    const image = (
      <div
        className="square"
        style={{ backgroundImage: `url('${path + college.logo}')` }}
      />
    );
    // let colStatus;
    let colDeleted;

    // if (college.status === 0) {
    //   colStatus = <span className="badge badge-success">Active</span>;
    // } else {
    //   colStatus = <span className="badge badge-danger">Not Active</span>;
    // }

    if (college.deleted === 1) {
      colDeleted = <span className="badge badge-danger">Deleted</span>;
    } else {
      // not status, just indicate that its not deleted
      colDeleted = <span className="badge badge-success">Active</span>;
    }

    return (
      <div className="col-lg-3 col-md-3 col-sm-6 col-6">
        <div className="card card-body bg-light mb-3">
          <div className="row">
            <div className="col-12">{image}</div>
            <div
              className="col-12"
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: "15px"
              }}
            >
              {college.name.fullName}
            </div>
            <div
              className="col-12"
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: "20px"
              }}
            >
              {college.name.initials}
            </div>
            <div className="col-12">
              <p>
                {/* {colStatus} */}
                {colDeleted}
              </p>
              <Link
                to={`/colleges/${college.name.initials}`}
                className="btn btn-info btn-block"
                style={{ fontSize: "12px" }}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CollegeItemGrid.propTypes = {
  college: PropTypes.object.isRequired
};

export default CollegeItemGrid;
