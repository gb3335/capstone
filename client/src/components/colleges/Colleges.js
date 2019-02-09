import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import { getColleges } from "../../actions/collegeActions";

import CollegeItem from "./CollegeItem";
import CollegesActions from "./CollegesAction";

class Colleges extends Component {
  componentDidMount() {
    this.props.getColleges();
  }

  render() {
    const { colleges, loading } = this.props.college;
    let collegeItems;

    if (colleges === null || loading) {
      collegeItems = <Spinner />;
    } else {
      if (colleges.length > 0) {
        collegeItems = colleges.map(college => (
          <CollegeItem key={college._id} college={college} />
        ));
      } else {
        collegeItems = <h4>No colleges found</h4>;
      }
    }

    return (
      <div className="colleges">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Colleges</h1>
              <p className="lead text-center">
                See all colleges and their informations
              </p>
              <CollegesActions />
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
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college
});

export default connect(
  mapStateToProps,
  { getColleges }
)(Colleges);
