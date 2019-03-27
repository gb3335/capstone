import React, { Component } from "react";

import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <p>
          {" "}
          <img
            src="./images/weblogo.png"
            alt="website-logo"
            style={{ width: "30px" }}
          />{" "}
          BulSU Plagiarism and Grammar Checker. Copyright{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    );
  }
}

export default Footer;
