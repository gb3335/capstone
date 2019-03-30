import React, { Component } from "react";
import Images from "./Images";

class JournalImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.journal.images

    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ images: nextProps.journal.images })

  }
  render() {
    const { journal } = this.props;
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

export default JournalImage;
