import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileFieldGroup from "../common/FileFieldGroup";
import { withRouter } from "react-router-dom";
import { addDocument, deleteDocument, onSideBySide } from "../../actions/researchActions";
import { checkPlagiarismLocal } from "../../actions/localPlagiarismActions";
import Spinner from "../common/Spinner";

import './ResearchDocumentActions.css'

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
          researchId: this.props.research.research._id,
          oldFile: this.props.research.research.document,
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

    const researchId = this.props.research.research._id;
    const filename = this.props.research.research.document;

    this.props.deleteDocument(researchId, filename, name);
  };

  onLocalCheck = e => {
    const input = {
      docuId: this.props.research.research._id,
      title: this.props.research.research.title,
      docuFile: this.props.research.research.document,
      researches: this.props.research.researches,
      flag: true,
      fromFlag: false,
      abstract: true
    };

    this.props.checkPlagiarismLocal(input, this.props.history);
  };

  onSidebySideFlagTrue = e => {
    const input = {
        fromFlag: true,
        abstract: true
    }
    this.props.onSideBySide(input);
  };

  render() {
    const { research } = this.props.research;
    let docuItem;

      docuItem = (
        <div className="docuItem btn-group-sm">
          <label to="#" onClick={this.onLocalCheck} className="btn btn-light">
            <i className="fas fa-search text-info mr-1" />
            Check Abstract |
            <i className="fas fa-database text-info mr-1 ml-1" />
            <b>All </b>
          </label>
          <label to="#" onClick={this.onSidebySideFlagTrue} className="btn btn-light">
            <i className="fas fa-search text-info mr-1" />
            Check Abstract |
            <i className="fas fa-copy text-info mr-1 ml-1" />
            <b>Side By Side</b>
          </label>
        </div>
      );

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
  onSideBySide: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  localPlagiarism: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  research: state.research,
  localPlagiarism: state.localPlagiarism,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addDocument, deleteDocument, checkPlagiarismLocal, onSideBySide }
)(withRouter(ResearchImageActions));