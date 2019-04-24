import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import SweetAlert from "react-bootstrap-sweetalert";
import ExcelFieldGroup from "../common/ExcelFileFieldGroup";
import {
  addExcel,
  toggleResearchBin,
  createReportForResearches
} from "../../actions/researchActions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    width: "350px",
    height: "410px"
  }
};

class ResearchesAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      researchId: true,
      college: true,
      course: true,
      type: true,
      pages: true,
      academicYear: true,
      lastUpdate: true,
      deletedResearches: false,
      bin: false,
      modalIsOpen: false,
      // for alerts
      checkOneAlert: false,
      generateAlert: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  onToggleBin = e => {
    if (this.props.research.bin === false) {
      this.props.toggleResearchBin(1);
    } else {
      this.props.toggleResearchBin(0);
    }
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#2874A6";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  onChange = e => {
    let bool;
    if (e.target.value === "false") {
      bool = true;
    } else {
      bool = false;
    }
    this.setState({ [e.target.name]: bool });
  };

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
          researchId: "excelResearch",
          oldFile: "excelResearch",
          file: this.state.file,
          username: name
        };

        this.props.addExcel(docuData, this.props.history);
      };
    } catch (error) {
      console.log("Not Blob");
    }
  };

  onGenerateReport = () => {
    if (!this.props.research.buttonDisable) {
      if (
        this.state.status === false &&
        this.state.researchId === false &&
        this.state.college === false &&
        this.state.course === false &&
        this.state.type === false &&
        this.state.pages === false &&
        this.state.academicYear === false &&
        this.state.lastUpdate === false &&
        this.state.deletedResearches === false
      ) {
        // show check one alert
        this.setState({ checkOneAlert: true });
      } else {
        const name =
          this.props.auth.user.name.firstName +
          " " +
          this.props.auth.user.name.middleName +
          " " +
          this.props.auth.user.name.lastName;

        const researchesReportData = {
          status: this.state.status,
          researchId: this.state.researchId,
          college: this.state.college,
          course: this.state.course,
          type: this.state.type,
          pages: this.state.pages,
          academicYear: this.state.academicYear,
          lastUpdate: this.state.lastUpdate,
          deletedResearches: this.state.deletedResearches,
          researches: this.props.research.researches,
          typeOfReport: "Researches Report",
          printedBy: name
        };

        this.props.createReportForResearches(researchesReportData);
        // show generate alert
        this.setState({ generateAlert: true });
      }
    }
  };

  // alert confirms
  onCheckOneAlert = () => {
    this.setState({ checkOneAlert: false });
  };

  onGenerateAlert = () => {
    this.setState({ generateAlert: false });
  };

  render() {
    let binAction;
    const disableFlag = this.props.research.buttonDisable;

    if (this.state.bin) {
      binAction = (
        <label
          to="#"
          onClick={this.onToggleBin}
          className="btn btn-light"
          style={{ fontSize: "14px" }}
        >
          <i className="fas fa-list-ul text-success mr-1" /> Researches
        </label>
      );
    } else {
      binAction = (
        <label
          to="#"
          onClick={this.onToggleBin}
          className="btn btn-light"
          style={{ fontSize: "14px" }}
        >
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </label>
      );
    }

    return (
      <div
        className="btn-toolbar mb-3"
        role="toolbar"
        aria-label="Toolbar with button groups"
      >
        <div className="btn-group" role="group" aria-label="First group">
          <Link
            to="/add-research"
            className="btn btn-light"
            style={{ fontSize: "14px", height: "81%" }}
          >
            <i className="fas fa-plus text-info mr-1" /> Add Research
          </Link>
        </div>
        <div className="btn-group " role="group" aria-label="Second group">
          <label
            to="#"
            onClick={this.openModal}
            className="btn btn-light"
            style={{ fontSize: "14px" }}
          >
            <i className="fas fa-poll-h text-info mr-1" /> Create Report
          </label>
        </div>
        {this.props.auth.user.userType === "LIBRARIAN" ? (
          <div className="btn-group" role="group" aria-label="Second group">
            <label
              to="#"
              htmlFor="input"
              className="btn btn-light"
              style={{ fontSize: "14px" }}
            >
              <i className="fas fa-file-import text-info mr-1" />
              Import Excel File to Database
            </label>
          </div>
        ) : (
          console.log(false)
        )}
        <div hidden>
          <ExcelFieldGroup
            placeholder="* Document"
            name="filename"
            onChange={this.onFileSelected}
            id="input"
          />
        </div>
        <div className="btn-group " role="group" aria-label="Second group">
          {binAction}
        </div>

        {/* ALERTS */}
        {/* PLEASE CHECK ONE ALERT */}
        <SweetAlert
          show={this.state.checkOneAlert}
          warning
          title="Oops!"
          onConfirm={this.onCheckOneAlert}
        >
          Please check at least one
        </SweetAlert>
        {/* ------------------------ */}
        {/* PLEASE CHECK ONE ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="row">
            <div className="col-12">
              <h2 ref={subtitle => (this.subtitle = subtitle)}>
                Create Report
              </h2>
              <div>
                <h4>Filter</h4>
              </div>
              <form>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="status"
                    id="status"
                    value={this.state.status}
                    onChange={this.onChange}
                    checked={this.state.status}
                  />
                  <label className="form-check-label" htmlFor="status">
                    Status
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="researchId"
                    id="researchId"
                    value={this.state.researchId}
                    onChange={this.onChange}
                    checked={this.state.researchId}
                  />
                  <label className="form-check-label" htmlFor="researchId">
                    Research ID
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="college"
                    id="college"
                    value={this.state.college}
                    onChange={this.onChange}
                    checked={this.state.college}
                  />
                  <label className="form-check-label" htmlFor="college">
                    College
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="course"
                    id="course"
                    value={this.state.course}
                    onChange={this.onChange}
                    checked={this.state.course}
                  />
                  <label className="form-check-label" htmlFor="course">
                    Course
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="type"
                    id="type"
                    value={this.state.type}
                    onChange={this.onChange}
                    checked={this.state.type}
                  />
                  <label className="form-check-label" htmlFor="type">
                    Research Type
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="pages"
                    id="pages"
                    value={this.state.pages}
                    onChange={this.onChange}
                    checked={this.state.pages}
                  />
                  <label className="form-check-label" htmlFor="pages">
                    Pages
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="academicYear"
                    id="academicYear"
                    value={this.state.academicYear}
                    onChange={this.onChange}
                    checked={this.state.academicYear}
                  />
                  <label className="form-check-label" htmlFor="academicYear">
                    Academic Year
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="lastUpdate"
                    id="lastUpdate"
                    value={this.state.lastUpdate}
                    onChange={this.onChange}
                    checked={this.state.lastUpdate}
                  />
                  <label className="form-check-label" htmlFor="lastUpdate">
                    Last Update
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    name="deletedResearches"
                    id="deletedResearches"
                    value={this.state.deletedResearches}
                    onChange={this.onChange}
                    checked={this.state.deletedResearches}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="deletedResearches"
                  >
                    Include Deleted Researches
                  </label>
                </div>
                <br />
                <input
                  type="button"
                  value="Cancel"
                  onClick={this.closeModal}
                  className="btn btn-danger"
                />{" "}
                {disableFlag ? (
                  <input
                    type="button"
                    value="Generate Report"
                    onClick={this.onGenerateReport}
                    className="btn btn-info disabled"
                  />
                ) : (
                  <input
                    type="button"
                    value="Generate Report"
                    onClick={this.onGenerateReport}
                    className="btn btn-info"
                  />
                )}
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ResearchesAction.propTypes = {
  toggleResearchBin: PropTypes.func.isRequired,
  createReportForResearches: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  bin: state.research.bin,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { toggleResearchBin, createReportForResearches, addExcel }
)(ResearchesAction);
