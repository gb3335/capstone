import React, { Component } from "react";


class ViewUserHeader extends Component {
  render() {
    const { user } = this.props;
    let fontColor = "black";



    String.prototype.getInitials = function (glue) {
      if (typeof glue == "undefined") {
        var glue = true;
      }

      var initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

      if (glue) {
        return initials.join('.');
      }

      return initials;
    };

    String.prototype.capitalize = function () {
      return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
      });
    };



    return (
      <div className="row">
        <div className="col-md-12">
          <div
            className="card card-body text-white mb-3 collegeCard"

          >
            <div className="row">
              <div className="col-4 col-md-3 m-auto d-md-block">
                <img
                  className="rounded-circle"
                  src={user.avatar}
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
                {user.name.firstName} {user.name.middleName.getInitials()}. {user.name.lastName}
              </h1>
              <p className="lead text-center" style={{ color: fontColor }}>
                <span>{user.college}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewUserHeader;
