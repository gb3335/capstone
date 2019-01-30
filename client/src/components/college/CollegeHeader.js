import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";

class CollegeHeader extends Component {
  render() {
    const path = "/images/collegeLogos/";
    const { college } = this.props;
    let fontColor;

    const c = college.color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 65) {
      fontColor = "white";
    } else {
      fontColor = "black";
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div
            className="card card-body text-white mb-3 collegeCard"
            style={{ backgroundColor: college.color }}
          >
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={path + college.logo}
                  alt=""
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="text-center">
              <h1
                className="display-4 text-center"
                style={{ color: fontColor }}
              >
                {college.name.initials}
              </h1>
              <p className="lead text-center" style={{ color: fontColor }}>
                <span>{college.name.fullName}</span>
              </p>
              <p style={{ color: fontColor }}>
                Librarian: <span>{college.librarian}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollegeHeader;
