import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class CollegeItemGrid extends Component {
  render() {
    const path =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/";
    const { college } = this.props;
    const image = (
      <img
        src={path + college.logo}
        alt={college.name.initials}
        className="rounded-circle"
        style={{ width: "50%", display: "block", margin: "auto" }}
      />
    );
    let colStatus;
    let colDeleted;

    if (college.status === 0) {
      colStatus = <span className="badge badge-success">Active</span>;
    } else {
      colStatus = <span className="badge badge-danger">Not Active</span>;
    }

    if (college.deleted === 1) {
      colDeleted = <span className="badge badge-danger">Deleted</span>;
    } else {
      // not status, just indicate that its not deleted
      colDeleted = <span className="badge badge-success">Active</span>;
    }

    return (
      <div className="col-3">
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
                className="btn btn-info"
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