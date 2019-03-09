import React from "react";
import { Link } from "react-router-dom";

const RegisterActions = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/register" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" /> Add Account
      </Link>
    </div>
  );
};

export default RegisterActions;
