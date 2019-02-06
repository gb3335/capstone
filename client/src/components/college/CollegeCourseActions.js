import React from "react";
import { Link } from "react-router-dom";

const CollegeCourseActions = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/add-course" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" /> Add Course
      </Link>
    </div>
  );
};

export default CollegeCourseActions;
