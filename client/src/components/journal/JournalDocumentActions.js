import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileFieldGroup from "../common/FileFieldGroup";
import { withRouter } from "react-router-dom";
import {
  addDocument,
  deleteDocument,
  onSideBySide
} from "../../actions/journalActions";
import { journalPlagiarismLocal } from "../../actions/localPlagiarismActions";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

import "./JournalDocumentAction.css";

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
        const name = this.props.auth.user.id;

        const docuData = {
          journalId: this.props.journal.journal._id,
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
    const name = this.props.auth.user.id;

    const journalId = this.props.journal.journal._id;
    const filename = this.props.journal.journal.document;

    this.props.deleteDocument(journalId, filename, name);
  };

  onLocalCheck = e => {
    const input = {
      docuId: this.props.journal.journal._id,
      title: this.props.journal.journal.title,
      docuFile: this.props.journal.journal.document,
      journals: this.props.journal.journals,
      flag: true,
      fromFlag: false,
      abstract: false
    };

    this.props.journalPlagiarismLocal(input, this.props.history);
  };

  onSidebySideFlagTrue = e => {
    const input = {
      fromFlag: true,
      abstract: false
    };
    this.props.onSideBySide(input);
  };

  render() {
    const { journal } = this.props.journal;
    let docuItem;

    if (journal.document) {
      if (
        this.props.auth.user.userType === "LIBRARIAN" &&
        this.props.auth.user.college === journal.college
      ) {
        docuItem = (
          <div
            className="btn-toolbar mb-3"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div className="btn-group" role="group" aria-label="First group">
              <label
                to="#"
                htmlFor="docUpload"
                className="btn btn-light"
                style={{ fontSize: "14px" }}
              >
                <i className="fas fa-redo-alt text-info mr-1" />
                Update Document
              </label>
            </div>
            <div className="btn-group" role="group" aria-label="Second group">
              <label
                to="#"
                onClick={this.onDeleteDocument}
                className="btn btn-danger"
                style={{ fontSize: "14px" }}
              >
                <i className="fas fa-trash text-light mr-1" />
                Remove Document
              </label>
            </div>
          </div>
        );
      }
      if (this.props.auth.user.userType === "ADMINISTRATOR") {
        docuItem = (
          <div
            className="btn-toolbar justify-content-between"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div>
              <div className="btn-group" role="group" aria-label="First group">
                <label
                  to="#"
                  onClick={this.onLocalCheck}
                  className="btn btn-light"
                  style={{ fontSize: "14px" }}
                >
                  <i className="fas fa-search text-info mr-1" />
                  Check Document |
                  <i className="fas fa-database text-info mr-1 ml-1" />
                  <b>All </b>
                </label>
              </div>
              <div className="btn-group" role="group" aria-label="First group">
                <label
                  to="#"
                  onClick={this.onSidebySideFlagTrue}
                  className="btn btn-light"
                  style={{ fontSize: "14px" }}
                >
                  <i className="fas fa-search text-info mr-1" />
                  Check Document |
                  <i className="fas fa-copy text-info mr-1 ml-1" />
                  <b>Side By Side</b>
                </label>
              </div>
            </div>
            <div className="input-group">
              <div className="btn-group" role="group" aria-label="Second group">
                <label
                  to="#"
                  htmlFor="docUpload"
                  className="btn btn-light"
                  style={{ fontSize: "14px" }}
                >
                  <i className="fas fa-redo-alt text-info mr-1" />
                  Update Document
                </label>
              </div>
              <div className="btn-group" role="group" aria-label="Second group">
                <label
                  to="#"
                  onClick={this.onDeleteDocument}
                  className="btn btn-danger"
                  style={{ fontSize: "14px" }}
                >
                  <i className="fas fa-trash text-light mr-1" />
                  Remove Document
                </label>
              </div>
            </div>
          </div>
        );
      }
    } else {
      docuItem = (
        <div
          className="btn-group mb-3 btn-group-sm"
          role="group"
          style={{ overflow: "auto" }}
        >
          <label to="#" htmlFor="docUpload" className="btn btn-light">
            <i className="fas fa-plus text-info mr-1" />
            Add Document
          </label>
        </div>
      );
    }

    return (
      <div>
        {this.props.localPlagiarism.loading ? (
          <div>
            <p>{this.props.localPlagiarism.axiosProgress.tag}</p>
            <Progress
              percent={this.props.localPlagiarism.axiosProgress.axiosProgress}
            />
          </div>
        ) : (
          docuItem
        )}

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
  journalPlagiarismLocal: PropTypes.func.isRequired,
  onSideBySide: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  journal: PropTypes.object.isRequired,
  localPlagiarism: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  journal: state.journal,
  localPlagiarism: state.localPlagiarism,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addDocument, deleteDocument, journalPlagiarismLocal, onSideBySide }
)(withRouter(ResearchImageActions));
