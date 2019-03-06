import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class CollegeItemList extends Component {
  render() {
    const path =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/";
    const { college } = this.props;
    const image = (
      <img
        src={path + college.logo}
        alt={college.name.initials}
        className="rounded-circle"
        style={{ width: "100%" }}
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
    }

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-lg-1 col-md-1 col-3">{image}</div>
          <div
            className="col-lg-6 col-md-7 col-3"
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontSize: "18px"
            }}
          >
            {college.name.fullName}
          </div>
          <div className="col-lg-2 col-md-2 col-3 d-sm-none d-md-block d-none d-sm-block">
            <p>
              {colStatus} {colDeleted}
            </p>
          </div>
          <div className="col-lg-2 col-md-2 col-3">
            <Link
              to={`/colleges/${college.name.initials}`}
              className="btn btn-info"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

CollegeItemList.propTypes = {
  college: PropTypes.object.isRequired
};

export default CollegeItemList;
