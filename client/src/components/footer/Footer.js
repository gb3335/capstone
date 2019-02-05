import React, { Component } from "react";

import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
          <p>Copyright {(new Date().getFullYear())}</p>
      </div>
    );
  }
}

export default Footer;
