import React from "react";
import { Link } from "react-router-dom";

const JournalAuthorAction = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/add-journal-author" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" /> Add Author
      </Link>
      <br />
    </div>
  );
};

export default JournalAuthorAction;
