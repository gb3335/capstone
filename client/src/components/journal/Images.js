import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Viewer from "react-viewer";
import "react-viewer/dist/index.css";

class Images extends Component {
  constructor() {
    super();

    this.state = {
      visible: false,
      activeIndex: 0
    };
  }

  onShowImage = index => {
    this.setState({ visible: true, activeIndex: --index });
  };

  render() {
    const path =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/journalImages/";
    let imageData = [];

    this.props.images.map(image =>
      imageData.push({
        src: path + image.name,
        thumbnail: path + image.name
      })
    );

    return (
      <div className="row">
        <div className="col-lg-12">
          <Viewer
            visible={this.state.visible}
            activeIndex={this.state.activeIndex}
            onClose={() => {
              this.setState({ visible: false });
            }}
            images={imageData}
          />
          <div className="thumbnails">
            {this.props.images.map((thum, index) => (
              <img
                key={thum._id}
                src={path + thum.name}
                alt={`research-image-${++index}`}
                style={{ width: "auto", height: "130px", cursor: "pointer" }}
                onClick={this.onShowImage.bind(this, index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Images.propTypes = {
  journal: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  journal: state.research
});

export default connect(mapStateToProps)(Images);
