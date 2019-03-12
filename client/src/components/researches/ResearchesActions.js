import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";

import {
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
    width: "410px",
    height: "460px"
  }
};

class ResearchesAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      researchId: false,
      college: false,
      course: false,
      type: false,
      pages: false,
      academicYear: false,
      lastUpdate: false,
      deletedResearches: false,
      bin: false,
      modalIsOpen: false
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

  onGenerateReport = () => {
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
      alert("Please check at least one");
    } else {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

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
      alert("Please wait while your report is being generated");
    }
  };

  render() {
    let binAction;
    const disableFlag = false;

    if (this.state.bin) {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> Researches
        </Link>
      );
    } else {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </Link>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <Link to="/add-research" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add Research
        </Link>
        <Link to="#" onClick={this.openModal} className="btn btn-light">
          <i className="fas fa-poll-h text-info mr-1" /> Create Report
        </Link>
        {binAction}

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button
            className="btn btn-danger"
            style={{ float: "right", fontSize: "15px" }}
            onClick={this.closeModal}
          >
            <i className="fas fa-times" />
          </button>
          <br />
          <br />
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
  { toggleResearchBin, createReportForResearches }
)(ResearchesAction);
