import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileFieldGroup from "../common/FileFieldGroup";
import { withRouter } from "react-router-dom";
import { addDocument, deleteDocument } from "../../actions/researchActions";

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
          oldFile: this.props.research.document,
          file: this.state.file
        };

        this.props.addDocument(docuData, this.props.history);
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  onDeleteDocument = e => {
    const researchId = this.props.research._id;
    const filename = this.props.research.document;

    this.props.deleteDocument(researchId, filename);
  };

  render() {
    const { research } = this.props;
    let docuItem;

    if (research.document) {
      docuItem = (
        <div className="btn-group mb-3 btn-group-sm" role="group">
          <label to="#" htmlFor="docUpload" className="btn btn-light">
            <i className="fas fa-redo-alt text-info mr-1" />
            Update Document
          </label>
          <label
            to="#"
            onClick={this.onDeleteDocument}
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
      <div>
        {docuItem}

        <div hidden>
          <FileFieldGroup
            placeholder="* Document"
            name="filename"
            value={this.state.filename}
            onChange={this.onFileSelected}
            id="docUpload"
          />
        </div>
      </div>
    );
  }
}

ResearchImageActions.propTypes = {
  addDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addDocument, deleteDocument }
)(withRouter(ResearchImageActions));
