import React, { Component } from "react";
import Images from "./Images";

class ResearchImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.research.images

    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ images: nextProps.research.images })

  }
  render() {
    const { research } = this.props;
    let imageItems;

    try {
      if (Object.keys(this.state.images).length > 0) {
        imageItems = <Images images={this.state.images} />;
      } else {
        imageItems = <span>No image is added in this journal.</span>;
      }
    } catch (error) { }

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
