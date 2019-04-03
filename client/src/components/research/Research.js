import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import SweetAlert from "react-bootstrap-sweetalert";
import { Spring, Transition, animated } from "react-spring/renderprops";

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
import ResearchAbstractActions from "./ResearchAbstractActions";
import Report from "./Report";
import ResearchSideBySide from "./ResearchSideBySide";

class Research extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Delete Alert
      deleteAlert: false,
      deleteAlertCancel: false,
      deleteAlertOkay: false,
      // Restore Alert
      restoreAlert: false,
      restoreAlertCancel: false,
      restoreAlertOkay: false,
      // Hide Alert
      hideAlert: false,
      hideAlertCancel: false,
      hideAlertOkay: false,
      // Show Alert
      showAlert: false,
      showAlertCancel: false,
      showAlertOkay: false
    };
  }

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
  // Delete research alerts
  onDeleteAlert = () => {
    this.setState({ deleteAlert: true });
  };
  onCancelDelete = () => {
    this.setState({ deleteAlert: false, deleteAlertCancel: true });
  };
  onRemoveDeleteCancel = () => {
    this.setState({ deleteAlertCancel: false });
  };
  onRemoveDeleteOkay = () => {
    this.setState({ deleteAlertOkay: false });
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.research.research._id,
      username: name
    };
    this.props.deleteResearch(data, this.props.history);
  };
  onDeleteResearch = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  // Restore research alerts
  onRestoreAlert = () => {
    this.setState({ restoreAlert: true });
  };
  onCancelRestore = () => {
    this.setState({ restoreAlert: false, restoreAlertCancel: true });
  };
  onRemoveRestoreCancel = () => {
    this.setState({ restoreAlertCancel: false });
  };
  onRemoveRestoreOkay = () => {
    this.setState({ restoreAlertOkay: false });
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.research.research._id,
      username: name
    };

    this.props.restoreResearch(data, this.props.history);
  };
  onRestoreResearch = e => {
    this.setState({ restoreAlertOkay: true, restoreAlert: false });
  };

  // Hide research Alerts
  onHideAlert = () => {
    this.setState({ hideAlert: true });
  };
  onCancelHide = () => {
    this.setState({ hideAlert: false, hideAlertCancel: true });
  };
  onRemoveHideCancel = () => {
    this.setState({ hideAlertCancel: false });
  };

  onRemoveHideOkay = () => {
    this.setState({ hideAlertOkay: false });
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.research.research._id,
      hidden: true,
      username: name
    };

    this.props.deleteResearch(data, this.props.history);
  };

  onHideResearch = e => {
    this.setState({ hideAlertOkay: true, hideAlert: false });
  };

  // show research alerts
  onShowAlert = () => {
    this.setState({ showAlert: true });
  };
  onCancelShow = () => {
    this.setState({ showAlert: false, showAlertCancel: true });
  };
  onRemoveShowCancel = () => {
    this.setState({ showAlertCancel: false });
  };

  onRemoveShowOkay = () => {
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.research.research._id,
      hidden: true,
      username: name
    };

    this.props.restoreResearch(data, this.props.history);
  };
  onShowResearch = e => {
    this.setState({ showAlertOkay: true, showAlert: false });
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
              onClick={this.onRestoreAlert}
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
              onClick={this.onDeleteAlert}
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
              onClick={this.onHideAlert}
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
              onClick={this.onShowAlert}
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
      let abstractDocuOrSideItems;

      if (this.props.research.onSideBySide && this.props.research.abstract) {
        abstractDocuOrSideItems = (
          <Transition
            items={
              this.props.research.onSideBySide && this.props.research.abstract
            }
            from={{ opacity: 0 }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {show =>
              show &&
              (props => (
                <animated.div style={props}>
                  <Spring
                    from={{ opacity: 0 }}
                    to={{ opacity: 1 }}
                    config={{ delay: 100, duration: 800 }}
                  >
                    {props => (
                      <div style={props}>
                        <ResearchSideBySide />
                      </div>
                    )}
                  </Spring>
                </animated.div>
              ))
            }
          </Transition>
        );
      } else {
        abstractDocuOrSideItems = (
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 100, duration: 800 }}
          >
            {props => (
              <div style={props}>
                <ResearchAbstractActions research={research} />
                <ResearchAbstract research={research} />
              </div>
            )}
          </Spring>
        );
      }

      let docuOrSideItems;

      if (this.props.research.onSideBySide && !this.props.research.abstract) {
        docuOrSideItems = (
          <Transition
            items={
              this.props.research.onSideBySide && !this.props.research.abstract
            }
            from={{ opacity: 0 }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {show =>
              show &&
              (props => (
                <animated.div style={props}>
                  <Spring
                    from={{ opacity: 0 }}
                    to={{ opacity: 1 }}
                    config={{ delay: 100, duration: 800 }}
                  >
                    {props => (
                      <div style={props}>
                        <ResearchSideBySide />
                      </div>
                    )}
                  </Spring>
                </animated.div>
              ))
            }
          </Transition>
        );
      } else {
        docuOrSideItems = (
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 100, duration: 800 }}
          >
            {props => (
              <div style={props}>
                {docAction}
                {doc}
              </div>
            )}
          </Spring>
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
                      {abstractDocuOrSideItems}
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
                      {docuOrSideItems}
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
        } catch (error) {}
      }
    } catch (error) {}

    return (
      <div className="research">
        {/* ALERTS */}
        {/* DELETE ALERT */}
        <SweetAlert
          show={this.state.deleteAlert}
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onDeleteResearch}
          onCancel={this.onCancelDelete}
        >
          Delete Research?
        </SweetAlert>

        {/* CANCEL DELETE */}
        <SweetAlert
          show={this.state.deleteAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveDeleteCancel}
        >
          Research is not deleted
        </SweetAlert>

        {/* RESEARCH DELETE */}
        <SweetAlert
          show={this.state.deleteAlertOkay}
          success
          title="Deleted"
          onConfirm={this.onRemoveDeleteOkay}
        >
          Research deleted
        </SweetAlert>
        {/* ---------------------- */}
        {/* RESTORE ALERT */}
        <SweetAlert
          show={this.state.restoreAlert}
          warning
          showCancel
          confirmBtnText="Yes, restore it!"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onRestoreResearch}
          onCancel={this.onCancelRestore}
        >
          Restore Research?
        </SweetAlert>

        {/* CANCEL RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveRestoreCancel}
        >
          Research is not restored
        </SweetAlert>

        {/* RESEARCH RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertOkay}
          success
          title="Restored"
          onConfirm={this.onRemoveRestoreOkay}
        >
          Research restored
        </SweetAlert>
        {/* ------------------------ */}
        {/* HIDE ALERT */}
        <SweetAlert
          show={this.state.hideAlert}
          warning
          showCancel
          confirmBtnText="Yes, hide it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onHideResearch}
          onCancel={this.onCancelHide}
        >
          Hide Research?
        </SweetAlert>

        {/* CANCEL HIDE */}
        <SweetAlert
          show={this.state.hideAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveHideCancel}
        >
          Research is not hidden
        </SweetAlert>

        {/* RESEARCH HIDE */}
        <SweetAlert
          show={this.state.hideAlertOkay}
          success
          title="Hidden"
          onConfirm={this.onRemoveHideOkay}
        >
          Research hidden
        </SweetAlert>
        {/* ------------------------ */}
        {/* SHOW ALERT */}
        <SweetAlert
          show={this.state.showAlert}
          warning
          showCancel
          confirmBtnText="Yes, show it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={this.onShowResearch}
          onCancel={this.onCancelShow}
        >
          Show Research?
        </SweetAlert>

        {/* CANCEL SHOW */}
        <SweetAlert
          show={this.state.showAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveShowCancel}
        >
          Research is not shown
        </SweetAlert>

        {/* RESEARCH SHOW */}
        <SweetAlert
          show={this.state.showAlertOkay}
          success
          title="Showed"
          onConfirm={this.onRemoveShowOkay}
        >
          Research showed
        </SweetAlert>

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
