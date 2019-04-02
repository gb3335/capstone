import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ImageFieldGroup from "../common/ImageFieldGroup";
import { withRouter } from "react-router-dom";
import { addImages } from "../../actions/journalActions";

class JournalImageActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      images: [],
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onFileSelected = e => {
    const files = e.target.files;
    const len = files.length;
    let i = 0;
    let ctr = 0;
    let upImages;

    for (i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = e => {
        this.setState({
          images: [...this.state.images, e.target.result]
        });
        upImages = this.state.images;
        ctr++;

        if (ctr === len) {
          const name =
            this.props.auth.user.firstName +
            " " +
            this.props.auth.user.middleName +
            " " +
            this.props.auth.user.lastName;
          const data = {
            images: upImages,
            id: this.props.journal.journal._id,
            username: name
          };

          this.props.addImages(data, this.props.history);
        }
      };
    }
  };

  render() {
    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <label to="#" htmlFor="imageUpload" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" />
          Add Image
        </label>

        <ImageFieldGroup
          placeholder="* Images"
          name="image"
          value={this.state.image}
          onChange={this.onFileSelected}
          multiple="multiple"
          id="imageUpload"
        />
      </div>
    );
  }
}

JournalImageActions.propTypes = {
  journal: PropTypes.object.isRequired,
  addImages: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  journal: state.journal,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addImages }
)(withRouter(JournalImageActions));