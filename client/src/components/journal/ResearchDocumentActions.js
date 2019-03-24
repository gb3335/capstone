import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileFieldGroup from "../common/FileFieldGroup";
import { withRouter } from "react-router-dom";
import { addDocument, deleteDocument } from "../../actions/journalActions";
import { checkPlagiarismLocal } from "../../actions/localPlagiarismActions";
import Spinner from "../common/Spinner";

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

        const name =
          this.props.auth.user.firstName +
          " " +
          this.props.auth.user.middleName +
          " " +
          this.props.auth.user.lastName;
        const docuData = {
          researchId: this.props.journal.journal._id,
          oldFile: this.props.journal.journal.document,
          file: this.state.file,
          username: name

        };

        this.props.addDocument(docuData, this.props.history);
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  onDeleteDocument = e => {
    const name =
      this.props.auth.user.firstName +
      " " +
      this.props.auth.user.middleName +
      " " +
      this.props.auth.user.lastName;
    const researchId = this.props.journal.journal._id;
    const filename = this.props.journal.journal.document;

    this.props.deleteDocument(researchId, filename, name);
  };

  onLocalCheck = e => {
    const input = {
      docuId: this.props.journal.journal._id,
      title: this.props.journal.journal.title,
      journals: this.props.journal.journals,
      flag: true
    };

    this.props.checkPlagiarismLocal(input, this.props.history);
  };

  render() {
    const { journal } = this.props.journal;
    let docuItem;

    if (journal.document) {
      docuItem = (
        <div className="btn-group mb-3 btn-group-sm" role="group">
          <label to="#" htmlFor="docUpload" className="btn btn-light">
            <i className="fas fa-redo-alt text-info mr-1" />
            Update Document
          </label>
          <label to="#" onClick={this.onLocalCheck} className="btn btn-light">
            <i className="fas fa-search text-info mr-1" />
            Check Document
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
        {this.props.localPlagiarism.loading ? <Spinner /> : docuItem}

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
  checkPlagiarismLocal: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  journal: PropTypes.object.isRequired,
  localPlagiarism: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  journal: state.journal,
  localPlagiarism: state.localPlagiarism,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addDocument, deleteDocument, checkPlagiarismLocal }
)(withRouter(ResearchImageActions));
