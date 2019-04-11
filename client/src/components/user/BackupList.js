import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import Spinner from "../common/Spinner";
import "date-fns";
import Modal from "react-modal";
import ReCAPTCHA from "react-google-recaptcha";

import {
  getBackups,
  restoreBackup,
  deleteBackup
} from "../../actions/registerActions";

const customStylesFilter = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "350px",
    height: "250px"
  }
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "330px",
    height: "170px"
  }
};

class BackupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      modalIsOpenDel: false,
      disabledBackupBtn: true,
      folder: "",
      id: "",
      restoreAlert: false,
      deleteAlert: false
    };
  }

  componentWillMount() {
    this.props.getBackups();
  }

  // Modal
  openModal = folder => {
    this.setState({ modalIsOpen: true, folder: folder });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#2874A6";
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      disabledBackupBtn: true
    });
  };

  openModalDel = (folder, id) => {
    this.setState({ modalIsOpenDel: true, folder: folder, id: id });
  };

  afterOpenModalDel = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#2874A6";
  };

  closeModalDel = () => {
    this.setState({
      modalIsOpenDel: false
    });
  };

  onRestore = () => {
    const restoreData = {
      folder: this.state.folder
    };
    this.props.restoreBackup(restoreData);
    this.setState({
      restoreAlert: true,
      modalIsOpen: false,
      disabledBackupBtn: true
    });
  };

  onDelete = () => {
    this.setState({
      deleteAlert: true,
      modalIsOpenDel: false
    });
  };

  onDeleteTrue = () => {
    const backupData = {
      folder: this.state.folder,
      id: this.state.id
    };

    this.props.deleteBackup(backupData, this.props.history);
  };

  render() {
    const { backups, loading } = this.props.backups;
    const { users, user } = this.props.users;
    let backupItems;
    let backupData;
    let names = [];
    let path = "";

    try {
      if (backups === null || loading) {
        backupItems = <Spinner />;
      } else {
        path = `/myaccount/${user._id}/backup-list/backup-list`;

        // Add Names to array
        backups.map((backup, index) => {
          users.map(user => {
            if (backup.by === user._id) {
              names[index] = user.userName ? user.userName : user.email;
            }
          });
        });

        backupData = backups.map((backup, index) =>
          true
            ? {
                name: backup.title,
                by: names[index],
                date:
                  backup.date +
                  moment(backup.date).format("MMMM Do YYYY, h:mm A"),
                actions: (
                  <div>
                    <Link
                      to="#"
                      className="btn btn-success"
                      style={{ fontSize: "14px" }}
                      onClick={this.openModal.bind(this, backup.folder)}
                    >
                      Restore
                    </Link>{" "}
                    <Link
                      to="#"
                      className="btn btn-danger"
                      style={{ fontSize: "14px" }}
                      onClick={this.openModalDel.bind(
                        this,
                        backup.folder,
                        backup._id
                      )}
                    >
                      Delete
                    </Link>
                  </div>
                )
              }
            : {
                name: null,
                by: null,
                date: null,
                actions: null
              }
        );

        backupItems = (
          <MaterialTable
            columns={[
              { title: "Backup Name", field: "name" },
              { title: "Backed up By", field: "by" },
              {
                title: "Date",
                field: "date",
                render: rowData => {
                  const date = moment(rowData.date.substr(0, 24)).format(
                    "MMMM Do YYYY, h:mm A"
                  );
                  return date;
                }
              },
              { title: "Actions", field: "actions" }
            ]}
            options={{
              pageSizeOptions: [10, 20, 30, 50, 100],
              emptyRowsWhenPaging: false,
              columnsButton: true,
              pageSize: 30
            }}
            data={backupData}
            title="Backups"
          />
        );
      }
    } catch (error) {}

    return (
      <div className="container">
        {/* RESTORE */}
        <SweetAlert
          show={this.state.restoreAlert}
          success
          title="Great!"
          onConfirm={() => this.setState({ restoreAlert: false })}
        >
          Successfully restore data
        </SweetAlert>

        {/* DELETE */}
        <SweetAlert
          show={this.state.deleteAlert}
          success
          title="Great!"
          onConfirm={this.onDeleteTrue}
        >
          Successfully delete backup
        </SweetAlert>

        {/* Backup Modal */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStylesFilter}
          contentLabel="Example Modal"
        >
          <div className="row">
            <div className="col-12">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Restore Backup?
              </h2>
              <br />
              <form>
                <ReCAPTCHA
                  sitekey="6Le7RJ0UAAAAAN8KGM_-BAUk226wx-JT8rrfa3JM"
                  onChange={() => this.setState({ disabledBackupBtn: false })}
                />
                <input
                  ref="backupBtn"
                  type="button"
                  value="Cancel"
                  onClick={() =>
                    this.setState({
                      modalIsOpen: false,
                      disabledBackupBtn: true
                    })
                  }
                  className="btn btn-danger mt-3"
                />{" "}
                {this.state.disabledBackupBtn ? (
                  <input
                    ref="backupBtn"
                    type="button"
                    value="Submit"
                    className="btn btn-info mt-3"
                    disabled
                  />
                ) : (
                  <input
                    ref="backupBtn"
                    type="button"
                    value="Submit"
                    onClick={this.onRestore}
                    className="btn btn-info mt-3"
                  />
                )}
              </form>
            </div>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={this.state.modalIsOpenDel}
          onAfterOpen={this.afterOpenModalDel}
          onRequestClose={this.closeModalDel}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="row">
            <div className="col-12">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Delete Backup?
              </h2>
              <br />
              <form>
                <input
                  ref="backupBtn"
                  type="button"
                  value="Cancel"
                  onClick={() =>
                    this.setState({
                      modalIsOpenDel: false
                    })
                  }
                  className="btn btn-danger mt-3"
                />{" "}
                <input
                  ref="backupBtn"
                  type="button"
                  value="Yes, Delete"
                  onClick={this.onDelete}
                  className="btn btn-info mt-3"
                />
              </form>
            </div>
          </div>
        </Modal>

        <div className="row">
          <div className="col-md-6">
            <Link to={path} className="btn btn-light mb-3 float-left">
              <i className="fas fa-angle-left" /> Back to Profile
            </Link>
          </div>
          <div className="col-md-6" />
        </div>
        <h1 className="display-4 text-center">Backups</h1>
        <p className="lead text-center">List of all Database Backups</p>

        {backupItems}
      </div>
    );
  }
}

BackupList.propTypes = {
  getBackups: PropTypes.func.isRequired,
  restoreBackup: PropTypes.func.isRequired,
  deleteBackup: PropTypes.func.isRequired,
  backups: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  backups: state.backups,
  auth: state.auth,
  users: state.users
});

export default connect(
  mapStateToProps,
  { getBackups, restoreBackup, deleteBackup }
)(BackupList);
