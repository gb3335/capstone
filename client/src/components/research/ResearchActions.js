import React from "react";
import { Link } from "react-router-dom";

const ResearchAction = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/edit-research" className="btn btn-light">
        <i className="fas fa-pen text-info mr-1" /> Edit Research
      </Link>

      <Link to="/delete-research" className="btn btn-danger">
        <i className="fas fa-trash text-light mr-1" /> Delete Research
      </Link>
    </div>
  );
};

export default ResearchAction;
