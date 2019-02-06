import React from "react";
import { Link } from "react-router-dom";

const ResearchImageActions = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/add-image" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" /> Add Image
      </Link>
    </div>
  );
};

export default ResearchImageActions;
