import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Gallery from "react-grid-gallery";

class Images extends Component {
  render() {
    const path =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchImages/";
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
          <Gallery images={imageData} enableImageSelection={false} />
          {/* <ImageGallery items={imageData} showFullscreenButton={false} /> */}
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
