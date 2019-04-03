import React, { Component } from "react";

import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <p>
          {" "}
          <img
            src="https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/landingLogo/logo.png"
            alt="website-logo"
            style={{ width: "25px" }}
          />{" "}
          Copyright © {new Date().getFullYear()}. BulSU Plagiarism and Grammar
          Checker
        </p>
      </div>
    );
  }
}

export default Footer;
