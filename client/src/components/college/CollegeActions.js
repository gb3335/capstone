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

    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    const collegeData = {
      initials: this.state.initials,
      oldLogo: this.props.college.college.logo,
      ext: this.state.ext,
      id: this.props.college.college._id,
      file: base64,
      username: name
    };

    this.props.changeCollegeLogo(collegeData, this.props.history);
  };

  render() {
    const deleted = this.props.college.college.deleted;
    let editAction;
    let logoAction;

    if (deleted === 0) {
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
              maxWidth: 1500,
              minHeight: 100,
              maxHeight: 1500
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
      </div>
    );
  }
}

CollegeActions.propTypes = {
  changeCollegeLogo: PropTypes.func.isRequired,
  deleteCollege: PropTypes.func.isRequired,
  restoreCollege: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { changeCollegeLogo, deleteCollege, restoreCollege }
)(withRouter(CollegeActions));
