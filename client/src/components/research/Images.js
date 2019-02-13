import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

class Images extends Component {
  render() {
    const path = "/images/researchImages/";
    let imageData = [];

    this.props.images.map(image =>
      imageData.push({
        original: path + image.name,
        thumbnail: path + image.name,
        sizes: "(max-width: 1em) 10vw"
      })
    );

    return (
      <div className="container">
        <div
          className="row"
          style={{
            textAlign: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <div className="col-lg-12">
            <ImageGallery items={imageData} showFullscreenButton={false} />
          </div>
        </div>
      </div>
    );
  }
}

Images.propTypes = {
  research: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research
});

export default connect(mapStateToProps)(Images);
