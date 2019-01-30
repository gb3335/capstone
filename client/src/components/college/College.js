import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import { getCollegeByInitials } from "../../actions/collegeActions";
import CollegeHeader from "./CollegeHeader";

class College extends Component {
  componentDidMount() {
    if (this.props.match.params.initials) {
      this.props.getCollegeByInitials(this.props.match.params.initials);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.college.college === null && this.props.college.loading) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { college, loading } = this.props.college;
    let collegeContent;

    if (college === null || loading) {
      collegeContent = <Spinner />;
    } else {
      collegeContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/colleges" className="btn btn-light mb-3 float-left">
                <i className="fas fa-angle-left" /> Back to Colleges
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
          <CollegeHeader college={college} />
        </div>
      );
    }

    return (
      <div className="college">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{collegeContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

College.propTypes = {
  college: PropTypes.object.isRequired,
  getCollegeByInitials: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  college: state.college
});

export default connect(
  mapStateToProps,
  { getCollegeByInitials }
)(College);
