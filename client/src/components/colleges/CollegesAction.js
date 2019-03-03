import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { toggleCollegeBin } from "../../actions/collegeActions";
import { stat } from "fs";

class CollegesActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  onToggleBin = e => {
    if (this.props.college.bin === false) {
      this.props.toggleCollegeBin(1);
    } else {
      this.props.toggleCollegeBin(0);
    }
  };

  render() {
    let binAction;
    if (this.state.bin) {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-list-ul text-success mr-1" /> College List
        </Link>
      );
    } else {
      binAction = (
        <Link to="#" onClick={this.onToggleBin} className="btn btn-light">
          <i className="fas fa-trash-alt text-danger mr-1" /> College Bin
        </Link>
      );
    }

    return (
      <div className="btn-group mb-3 btn-group-sm" role="group">
        <Link to="/add-college" className="btn btn-light">
          <i className="fas fa-plus text-info mr-1" /> Add College
        </Link>
        {binAction}
      </div>
    );
  }
}
CollegesActions.propTypes = {
  toggleCollegeBin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  bin: state.college.bin
});

export default connect(
  mapStateToProps,
  { toggleCollegeBin }
)(CollegesActions);
