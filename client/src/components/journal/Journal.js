import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import SweetAlert from "react-bootstrap-sweetalert";
import { Spring, Transition, animated } from "react-spring/renderprops";

import {
  getJournalById,
  deleteJournal,
  restoreJournal
} from "../../actions/journalActions";

import JournalHeader from "./JournalHeader";
import JournalDescription from "./JournalDescription";
import JournalAuthors from "./JournalAuthor";
import JournalImages from "./JournalImage";
import JournalActions from "./JournalAction";
import JournalAuthorAction from "./JournalAuthorAction";
import JournalImageAction from "./JournalImageActions";
import JournalDocument from "./JournalDocument";
import JournalDocumentAction from "./JournalDocumentActions";
import Report from "./Report";
import JournalSideBySide from "./JournalSideBySide";

class Journal extends Component {
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
      this.props.getJournalById(this.props.match.params.id);
    }
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getJournalById(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.journal.journal === null && this.props.journal.loading) {
      this.props.history.push("/not-found");
    }
  }

  // Delete alerts
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
      id: this.props.journal.journal._id,
      username: name
    };
    this.props.deleteJournal(data, this.props.history);
  };
  onDeleteResearch = () => {
    this.setState({ deleteAlertOkay: true, deleteAlert: false });
  };

  // Restore alerts
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
      id: this.props.journal.journal._id,
      username: name
    };

    this.props.restoreJournal(data, this.props.history);
  };
  onRestoreResearch = e => {
    this.setState({ restoreAlertOkay: true, restoreAlert: false });
  };

  // Hide Alerts
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
      id: this.props.journal.journal._id,
      hidden: true,
      username: name
    };

    this.props.deleteJournal(data, this.props.history);
  };

  onHideResearch = e => {
    this.setState({ hideAlertOkay: true, hideAlert: false });
  };

  // show journal alerts
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
    this.setState({ showAlertOkay: false });
    const name = this.props.auth.user.id;

    const data = {
      id: this.props.journal.journal._id,
      hidden: true,
      username: name
    };

    this.props.restoreJournal(data, this.props.history);
  };
  onShowResearch = e => {
    this.setState({ showAlertOkay: true, showAlert: false });
  };

  render() {
    const { journal, loading } = this.props.journal;
    let deletedAction;
    let hideAction;
    let journalContent;
    let journalAction;
    let authorAction;
    let imageAction;
    let docAction;
    let doc;
    let docSideAction;
    let reportSideAction;
    try {
      const deleted = journal.deleted;
      const hidden = journal.hidden;

      if (this.props.auth.isAuthenticated) {
        if (deleted === 0) {
          if (
            (this.props.auth.user.userType === "LIBRARIAN" &&
              this.props.auth.user.college === journal.college) ||
            this.props.auth.user.userType === "ADMINISTRATOR"
          ) {
            authorAction = <JournalAuthorAction />;
            imageAction = <JournalImageAction />;
          }
          docAction = <JournalDocumentAction journal={journal} />;
        }
        // check if journal is deleted
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
        // check if journal is hidden
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
              Hide Journal
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
              Show Journal
            </a>
          );
        }
        if (
          (this.props.auth.user.userType === "LIBRARIAN" &&
            this.props.auth.user.college === journal.college) ||
          this.props.auth.user.userType === "ADMINISTRATOR"
        ) {
          journalAction = <JournalActions />;
        }
        doc = <JournalDocument journal={journal} />;
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

      let docuOrSideItems;

      if (this.props.journal.onSideBySide) {
        docuOrSideItems = (
          <Transition
            items={this.props.journal.onSideBySide}
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
                        <JournalSideBySide />
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

      if (journal === null || loading) {
        journalContent = <Spinner />;
      } else {
        try {
          if (
            this.props.auth.user.userType === "LIBRARIAN" &&
            this.props.auth.user.college !== this.props.journal.journal.college
          ) {
            docSideAction = "";
            reportSideAction = "";
            hideAction = "";
            deletedAction = "";
          }

          journalContent = (
            <div>
              {/* <div hidden>
              <p>{journal.title}</p>
            </div> */}
              <div className="row">
                <div className="col-md-6">
                  <Link
                    to="/journals"
                    className="btn btn-light mb-3 float-left"
                  >
                    <i className="fas fa-angle-left" /> Back to Journal
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
                      Journal Details
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
                      Description
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
                      {journalAction}
                      <JournalHeader journal={journal} />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="list-abstract"
                      role="tabpanel"
                      aria-labelledby="list-abstract-list"
                    >
                      <JournalDescription journal={journal} />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="list-authors"
                      role="tabpanel"
                      aria-labelledby="list-authors-list"
                    >
                      {authorAction}
                      <JournalAuthors journal={journal} />
                    </div>

                    <div
                      className="tab-pane fade"
                      id="list-pictures"
                      role="tabpanel"
                      aria-labelledby="list-pictures-list"
                    >
                      {imageAction}
                      <JournalImages journal={journal} />
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
          Delete Journal?
        </SweetAlert>

        {/* CANCEL DELETE */}
        <SweetAlert
          show={this.state.deleteAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveDeleteCancel}
        >
          Journal is not deleted
        </SweetAlert>

        {/* RESEARCH DELETE */}
        <SweetAlert
          show={this.state.deleteAlertOkay}
          success
          title="Deleted"
          onConfirm={this.onRemoveDeleteOkay}
        >
          Journal deleted
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
          Restore Journal?
        </SweetAlert>

        {/* CANCEL RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveRestoreCancel}
        >
          Journal is not restored
        </SweetAlert>

        {/* RESEARCH RESTORE */}
        <SweetAlert
          show={this.state.restoreAlertOkay}
          success
          title="Restored"
          onConfirm={this.onRemoveRestoreOkay}
        >
          Journal restored
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
          Hide Journal?
        </SweetAlert>

        {/* CANCEL HIDE */}
        <SweetAlert
          show={this.state.hideAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveHideCancel}
        >
          Journal is not hidden
        </SweetAlert>

        {/* RESEARCH HIDE */}
        <SweetAlert
          show={this.state.hideAlertOkay}
          success
          title="Hidden"
          onConfirm={this.onRemoveHideOkay}
        >
          Journal hidden
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
          Show Journal?
        </SweetAlert>

        {/* CANCEL SHOW */}
        <SweetAlert
          show={this.state.showAlertCancel}
          danger
          title="Cancelled"
          onConfirm={this.onRemoveShowCancel}
        >
          Journal is not shown
        </SweetAlert>

        {/* RESEARCH SHOW */}
        <SweetAlert
          show={this.state.showAlertOkay}
          success
          title="Showed"
          onConfirm={this.onRemoveShowOkay}
        >
          Journal showed
        </SweetAlert>
        <div style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-12">{journalContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Journal.propTypes = {
  journal: PropTypes.object.isRequired,
  getJournalById: PropTypes.func.isRequired,
  deleteJournal: PropTypes.func.isRequired,
  restoreJournal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  journal: state.journal,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getJournalById, deleteJournal, restoreJournal }
)(Journal);
