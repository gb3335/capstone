import React, { Component } from "react";

class ViewUserHeader extends Component {
  render() {
    const { user } = this.props;
    let fontColor = "black";

    String.prototype.getInitials = function(glue) {
      if (typeof glue == "undefined") {
        var glue = true;
      }

      var initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

      if (glue) {
        return initials.join(".");
      }

      return initials;
    };

    String.prototype.capitalize = function() {
      return this.toLowerCase().replace(/\b\w/g, function(m) {
        return m.toUpperCase();
      });
    };

    let path = "";

    if (user.avatar === "/images/User.png") {
      path = "/images/User.png";
    } else {
      path =
        "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/userImages/" +
        user.avatar;
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body text-white mb-3 collegeCard shadow">
            <div className="row">
              <div className="col-4 col-md-3 m-auto d-md-block">
                <div
                  className="square"
                  style={{ backgroundImage: `url('${path}')` }}
                />
              </div>
            </div>
            <div className="text-center">
              <h1
                className="display-4 text-center"
                style={{ color: fontColor }}
              >
                {user.name.firstName}{" "}
                {user.name.middleName ? user.name.middleName.getInitials() : ""}
                {user.name.middleName ? ". " : ""} {user.name.lastName}
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
