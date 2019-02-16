import React, { Component } from "react";
import Images from "./Images";

class ResearchImages extends Component {
  render() {
    const { research } = this.props;
    let imageItems;

    try {
      if (Object.keys(research.images).length > 0) {
        imageItems = <Images images={research.images} />;
      } else {
        imageItems = <span>No image is added in this research</span>;
      }
    } catch (error) {}
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-info">Images</h5>
          <hr />
          {imageItems}
        </div>
      </div>
    );
  }
}

export default ResearchImages;
