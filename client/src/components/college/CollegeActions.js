import React from "react";
import { Link } from "react-router-dom";
import { ImagePicker } from "react-file-picker";

const CollegeActions = () => {
  return (
    <div className="btn-group mb-3 btn-group-sm" role="group">
      <Link to="/edit-college" className="btn btn-light">
        <i className="fas fa-pen text-info mr-1" /> Edit College
      </Link>

      <li to="#" className="btn btn-light">
        <ImagePicker
          extensions={["jpg", "jpeg", "png"]}
          dims={{
            minWidth: 100,
            maxWidth: 500,
            minHeight: 100,
            maxHeight: 500
          }}
          onChange={base64 => console.log(base64)}
          onError={errMsg => console.log(errMsg)}
        >
          <span>
            <i className="fas fa-circle-notch text-info mr-1" />
            Change Logo
          </span>
        </ImagePicker>
      </li>

      <Link to="/add-course" className="btn btn-light">
        <i className="fas fa-plus text-info mr-1" />
        Add Course
      </Link>
    </div>
  );
};

export default CollegeActions;
