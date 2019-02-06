import React from "react";
import { Link } from "react-router-dom";

const ResearchesAction = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/add-research" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" /> Add Research
      </Link>
    </div>
  );
};

export default ResearchesAction;
