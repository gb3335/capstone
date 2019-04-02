import React from "react";
import { Link } from "react-router-dom";

const UserLogsAction = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/viewusers" className="btn btn-light">
        <i className="fas fa-angle-left mr-1" /> Go to users
      </Link>
    </div>
  );
};

export default UserLogsAction;



