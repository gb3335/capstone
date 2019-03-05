import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { ImagePicker } from "react-file-picker";

import {
  changeCollegeLogo,
  deleteCollege,
  restoreCollege
} from "../../actions/collegeActions";

class CollegeActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initials: this.props.college.college.name.initials,
      ext: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onFileSelected = base64 => {
    const fileExtension = base64.split(";")[0].split("/")[1];

    this.setState({ ext: fileExtension });

    const collegeData = {
      initials: this.state.initials,
      oldLogo: this.props.college.college.logo,
      ext: this.state.ext,
      id: this.props.college.college._id,
      file: base64
    };

    this.props.changeCollegeLogo(collegeData, this.props.history);
  };

  onDeleteCollege = e => {
    e.preventDefault();

    const data = {
      id: this.props.college.college._id,
      logo: this.props.college.college.logo
    };

    this.props.deleteCollege(data, this.props.history);
  };

  onRestoreCollege = e => {
    e.preventDefault();

    const data = {
      id: this.props.college.college._id,
      logo: this.props.college.college.logo
    };

    this.props.restoreCollege(data, this.props.history);
  };

  render() {
    const status = this.props.college.college.status;
    let statusAction;
    let editAction;
    let logoAction;

    if (status === 1) {
      statusAction = (
        <Link
          to="#"
          onClick={this.onRestoreCollege}
          className="btn btn-success"
        >
          <i className="fas fa-recycle text-light mr-1" />
          Restore
        </Link>
      );
    } else {
      statusAction = (
        <Link to="#" onClick={this.onDeleteCollege} className="btn btn-danger">
          <i className="fas fa-trash text-light mr-1" />
          Move to Bin
        </Link>
      );
      editAction = (
        <Link to="/edit-college" className="btn btn-light">
          <i className="fas fa-pen text-info mr-1" /> Edit College
        </Link>
      );
      logoAction = (
        <li to="#" className="btn btn-light">
          <ImagePicker
            extensions={["jpg", "jpeg", "png"]}
            dims={{
              minWidth: 100,
              maxWidth: 800,
              minHeight: 100,
              maxHeight: 800
            }}
            onChange={base64 => this.onFileSelected(base64)}
            onError={errMsg => alert(errMsg)}
          >
            <span>
              <i className="fas fa-circle-notch text-info mr-1" />
              Change Logo
            </span>
          </ImagePicker>
        </li>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        {editAction}
        {logoAction}
        {statusAction}
      </div>
    );
  }
}

CollegeActions.propTypes = {
  changeCollegeLogo: PropTypes.func.isRequired,
  deleteCollege: PropTypes.func.isRequired,
  restoreCollege: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { changeCollegeLogo, deleteCollege, restoreCollege }
)(withRouter(CollegeActions));
