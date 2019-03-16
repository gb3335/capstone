import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";

import {
  getResearchById,
  deleteResearch,
  restoreResearch
} from "../../actions/researchActions";

import ResearchHeader from "./ResearchHeader";
import ResearchAbstract from "./ResearchAbstract";
import ResearchAuthors from "./ResearchAuthors";
import ResearchImages from "./ResearchImages";
import ResearchActions from "./ResearchActions";
import ResearchAuthorActions from "./ResearchAuthorActions";
import ResearchImageActions from "./ResearchImageActions";
import ResearchDocument from "./ResearchDocument";
import ResearchDocumentActions from "./ResearchDocumentActions";
import Report from "./Report";

class Research extends Component {
  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.getResearchById(this.props.match.params.id);
    }
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getResearchById(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.research.research === null && this.props.research.loading) {
      this.props.history.push("/not-found");
    }
  }

  onDeleteResearch = e => {
    e.preventDefault();

    const data = {
      id: this.props.research.research._id
    };

    this.props.deleteResearch(data, this.props.history);
  };

  onRestoreResearch = e => {
    e.preventDefault();

    const data = {
      id: this.props.research.research._id
    };

    this.props.restoreResearch(data, this.props.history);
  };

  onHideResearch = e => {
    e.preventDefault();

    const data = {
      id: this.props.research.research._id,
      hidden: true
    };

    this.props.deleteResearch(data, this.props.history);
  };

  onShowResearch = e => {
    e.preventDefault();

    const data = {
      id: this.props.research.research._id,
      hidden: true
    };

    this.props.restoreResearch(data, this.props.history);
  };

  render() {
    const { research, loading } = this.props.research;
    let deletedAction;
    let hideAction;
    let researchContent;
    let researchAction;
    let authorAction;
    let imageAction;
    let docAction;
    let doc;
    let docSideAction;
    let reportSideAction;

    try {
      const deleted = research.deleted;
      const hidden = research.hidden;

      if (this.props.auth.isAuthenticated) {
        if (deleted === 0) {
          authorAction = <ResearchAuthorActions />;
          imageAction = <ResearchImageActions />;
          docAction = <ResearchDocumentActions research={research} />;
        }
        // check if research is deleted
        if (deleted === 1) {
          deletedAction = (
            <a
              className="list-group-item list-group-item-action btn btn-success"
              id="list-restore-list"
              data-toggle="list"
              href="#list-restore"
              role="tab"
              aria-controls="restore"
              onClick={this.onRestoreResearch}
            >
              <i className="fas fa-recycle mr-2" />
              Restore
            </a>
          );
        } else {
          deletedAction = (
            <a
              className="list-group-item list-group-item-action btn btn-danger"
              id="list-delete-list"
              data-toggle="list"
              href="#list-delete"
              role="tab"
              aria-controls="delete"
              onClick={this.onDeleteResearch}
            >
              <i className="fas fa-trash mr-2" />
              Move to Bin
            </a>
          );
        }
        // check if research is hidden
        if (deleted === 0 && hidden === 0) {
          hideAction = (
            <a
              className="list-group-item list-group-item-action"
              id="list-hide-list"
              data-toggle="list"
              href="#list-hide"
              role="tab"
              aria-controls="hide"
              onClick={this.onHideResearch}
            >
              <i className="fas fa-eye-slash mr-2" />
              Hide Research
            </a>
          );
        }
        if (deleted === 0 && hidden === 1) {
          hideAction = (
            <a
              className="list-group-item list-group-item-action"
              id="list-hide-list"
              data-toggle="list"
              href="#list-hide"
              role="tab"
              aria-controls="hide"
              onClick={this.onShowResearch}
            >
              <i className="fas fa-eye mr-2" />
              Show Research
            </a>
          );
        }
        researchAction = <ResearchActions />;
        doc = <ResearchDocument research={research} />;
        docSideAction = (
          <a
            className="list-group-item list-group-item-action"
            id="list-document-list"
            data-toggle="list"
            href="#list-document"
            role="tab"
            aria-controls="document"
          >
            <i className="fas fa-file mr-2" />
            Document
          </a>
        );
        reportSideAction = (
          <a
            className="list-group-item list-group-item-action"
            id="list-report-list"
            data-toggle="list"
            href="#list-report"
            role="tab"
            aria-controls="report"
          >
            <i className="fas fa-poll-h mr-2" />
            Report
          </a>
        );
      }

      if (research === null || loading) {
        researchContent = <Spinner />;
      } else {
        try {
          researchContent = (
            <div>
              {/* <div hidden>
              <p>{research.title}</p>
            </div> */}
              <div className="row">
                <div className="col-md-6">
                  <Link
                    to="/researches"
                    className="btn btn-light mb-3 float-left"
                  >
                    <i className="fas fa-angle-left" /> Back to Researches
                  </Link>
                </div>
                <div className="col-md-6" />
              </div>
              <div className="row" style={{ margin: "5px" }}>
                <div className="col-md-3">
                  <br />
                  <div className="list-group" id="list-tab" role="tablist">
                    <a
                      className="list-group-item list-group-item-action active"
                      id="list-details-list"
                      data-toggle="list"
                      href="#list-details"
                      role="tab"
                      aria-controls="details"
                    >
                      <i className="fas fa-info-circle mr-2" />
                      Research Details
                    </a>
                    <a
                      className="list-group-item list-group-item-action"
                      id="list-abstract-list"
                      data-toggle="list"
                      href="#list-abstract"
                      role="tab"
                      aria-controls="abstract"
                    >
                      <i className="fas fa-file-alt mr-2" />
                      Abstract
                    </a>

                    <a
                      className="list-group-item list-group-item-action"
                      id="list-authors-list"
                      data-toggle="list"
                      href="#list-authors"
                      role="tab"
                      aria-controls="authors"
                    >
                      <i className="fas fa-users mr-2" />
                      Authors
                    </a>

                    <a
                      className="list-group-item list-group-item-action"
                      id="list-pictures-list"
                      data-toggle="list"
                      href="#list-pictures"
                      role="tab"
                      aria-controls="pictures"
                    >
                      <i className="fas fa-images mr-2" />
                      Pictures
                    </a>
                    {docSideAction}
                    {reportSideAction}
                    {hideAction}
                    {deletedAction}
                  </div>
                </div>

                <div className="col-md-9">
                  <br />
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="list-details"
                      role="tabpanel"
                      aria-labelledby="list-details-list"
                    >
                      {researchAction}
                      <ResearchHeader research={research} />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="list-abstract"
                      role="tabpanel"
                      aria-labelledby="list-abstract-list"
                    >
                      <ResearchAbstract research={research} />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="list-authors"
                      role="tabpanel"
                      aria-labelledby="list-authors-list"
                    >
                      {authorAction}
                      <ResearchAuthors research={research} />
                    </div>

                    <div
                      className="tab-pane fade"
                      id="list-pictures"
                      role="tabpanel"
                      aria-labelledby="list-pictures-list"
                    >
                      {imageAction}
                      <ResearchImages research={research} />
                    </div>

                    <div
                      className="tab-pane fade"
                      id="list-document"
                      role="tabpanel"
                      aria-labelledby="list-document-list"
                    >
                      {docAction}
                      {doc}
                    </div>
                    <div
                      className="tab-pane fade"
                      id="list-report"
                      role="tabpanel"
                      aria-labelledby="list-report-list"
                    >
                      <Report />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } catch (error) { }
      }
    } catch (error) { }
    return (
      <div className="research">
        <div style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-12">{researchContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Research.propTypes = {
  research: PropTypes.object.isRequired,
  getResearchById: PropTypes.func.isRequired,
  deleteResearch: PropTypes.func.isRequired,
  restoreResearch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getResearchById, deleteResearch, restoreResearch }
)(Research);
