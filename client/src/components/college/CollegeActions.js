import React from "react";
import { Link } from "react-router-dom";

const CollegeActions = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/edit-college" className="btn btn-light">
        <i className="fas fa-pen text-info mr-1" /> Edit College
      </Link>
      <Link to="/change-logo" className="btn btn-light">
        <i className="fas fa-circle-notch text-info mr-1" />
        Change Logo
      </Link>
      <Link to="/add-course" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" />
        Add Course
      </Link>
    </div>
  );
};

export default CollegeActions;
