import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  toggleCollegeBin,
  toggleCollegeList
} from "../../actions/collegeActions";

class CollegesActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false,
      list: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
    this.setState({ list: nextProps.list });
  }

  onToggleBin = e => {
    if (this.props.college.bin === false) {
      this.props.toggleCollegeBin(1);
    } else {
      this.props.toggleCollegeBin(0);
    }
  };

  onToggleList = e => {
    if (this.props.college.list === false) {
      this.props.toggleCollegeList(1);
    } else {
      this.props.toggleCollegeList(0);
    }
  };

  render() {
    let binAction;
    let binActionForAuth;
    let listAction;
    let addAction;

    if (this.state.bin) {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> Colleges
        </Link>
      );
    } else {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> Bin
        </Link>
      );
    }

    if (this.state.list) {
      listAction = (
        <Link to="#" onClick={this.onToggleList} className="btn btn-light">
          <i className="fas fa-list text-info mr-1" /> List
        </Link>
      );
    } else {
      listAction = (
        <Link to="#" onClick={this.onToggleList} className="btn btn-light">
          <i className="fas fa-th-large text-info mr-1" /> Grid
        </Link>
      );
    }

    if (this.props.auth.isAuthenticated) {
      addAction = (
        <Link to="/add-college" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add College
        </Link>
      );
      binActionForAuth = binAction;
    }

    return (
      <div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {addAction}
          {binActionForAuth}
        </div>
        <div
          className="btn-group mb-3 btn-group-sm"
          role="group"
          style={{ float: "right" }}
        >
          {listAction}
        </div>
      </div>
    );
  }
}
CollegesActions.propTypes = {
  toggleCollegeBin: PropTypes.func.isRequired,
  toggleCollegeList: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  bin: state.college.bin,
  list: state.college.list,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { toggleCollegeBin, toggleCollegeList }
)(CollegesActions);
