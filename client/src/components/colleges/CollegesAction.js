import React from "react";
import { Link } from "react-router-dom";

const CollegesActions = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/add-college" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" /> Add College
      </Link>
    </div>
  );
};

export default CollegesActions;
