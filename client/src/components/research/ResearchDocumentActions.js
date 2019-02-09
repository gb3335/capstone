import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileFieldGroup from "../common/FileFieldGroup";
import { withRouter } from "react-router-dom";
//import { addImages } from "../../actions/researchActions";

class ResearchImageActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: "",
      file: "",
      ext: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onFileSelected = e => {
    try {
      let files = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = e => {
        this.setState({
          file: e.target.result
        });

        console.log("File: " + this.state.filename + " " + this.state.file);
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  render() {
    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <label to="#" htmlFor="docUpload" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" />
          Add Document
        </label>

        <FileFieldGroup
          placeholder="* Document"
          name="filename"
          value={this.state.filename}
          onChange={this.onFileSelected}
          id="docUpload"
        />
      </div>
    );
  }
}

ResearchImageActions.propTypes = {
  research: PropTypes.object.isRequired,
  //addImages: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(ResearchImageActions));
