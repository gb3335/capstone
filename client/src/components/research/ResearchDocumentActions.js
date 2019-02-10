import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileFieldGroup from "../common/FileFieldGroup";
import { withRouter, Link } from "react-router-dom";
import { addDocument } from "../../actions/researchActions";

class ResearchImageActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
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

        const docuData = {
          researchId: this.props.research._id,
          file: this.state.file
        };

        this.props.addDocument(docuData, this.props.history);
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  render() {
    const { research } = this.props;
    let docuItem;

    if (research.document) {
      docuItem = (
        <div className="btn-group mb-3 btn-group-sm" role="group">
          <label to="#" htmlFor="docUpload" className="btn btn-light">
            <i className="fas fa-plus text-info mr-1" />
            Update Document
          </label>
          <label
            to="#"
            //onClick={this.onDeleteResearch}
            className="btn btn-danger"
          >
            <i className="fas fa-trash text-light mr-1" />
            Remove Document
          </label>
        </div>
      );
    } else {
      docuItem = (
        <div className="btn-group mb-3 btn-group-sm" role="group">
          <label to="#" htmlFor="docUpload" className="btn btn-light">
            <i className="fas fa-plus text-info mr-1" />
            Add Document
          </label>
        </div>
      );
    }

    return (
      <div className="document">
        {docuItem}

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
  addDocument: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addDocument }
)(withRouter(ResearchImageActions));
