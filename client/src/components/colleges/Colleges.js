import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import { getColleges } from "../../actions/collegeActions";

import CollegeItem from "./CollegeItem";
import CollegesActions from "./CollegesAction";

class Colleges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false
    };
  }

  componentWillMount() {
    this.props.getColleges();
  }

  componentDidMount() {
    this.props.getColleges();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
  }

  render() {
    const { colleges, loading } = this.props.college;
    let collegeItems;
    let action;
    let title = "Colleges";
    let info = "See all colleges and their informations";

    if (colleges === null || loading) {
      collegeItems = <Spinner />;
    } else {
      if (colleges.length > 0) {
        if (this.state.bin) {
          collegeItems = colleges.map(college =>
            college.status === 1 ? (
              <CollegeItem key={college._id} college={college} />
            ) : (
              ""
            )
          );
          title = "College Bin";
          info = "List of Deactivated Colleges";
        } else {
          collegeItems = colleges.map(college =>
            college.status === 0 ? (
              <CollegeItem key={college._id} college={college} />
            ) : (
              ""
            )
          );
          title = "Colleges";
          info = "See all colleges and their informations";
        }
      } else {
        collegeItems = <h4>No colleges found</h4>;
      }
    }

    if (this.props.auth.isAuthenticated) {
      action = <CollegesActions />;
    }

    return (
      <div className="colleges">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">{title}</h1>
              <p className="lead text-center">{info}</p>
              {action}
              {collegeItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Colleges.propTypes = {
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  bin: state.college.bin,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getColleges }
)(Colleges);
