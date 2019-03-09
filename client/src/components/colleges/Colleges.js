import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import {
  getColleges,
  getCollegeByInitials
} from "../../actions/collegeActions";

import CollegeItem from "./CollegeItem";
import CollegeItemList from "./CollegeItemList";
import CollegeItemGrid from "./CollegeItemGrid";
import CollegesActions from "./CollegesAction";

class Colleges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bin: false,
      list: false
    };
  }

  componentWillMount() {
    this.props.getColleges();
  }

  componentDidMount() {
    this.props.getColleges();
    let initials;
    try {
      initials = this.props.college.colleges[0].name.initials;
    } catch (error) {}

    this.props.getCollegeByInitials(initials);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bin: nextProps.bin });
    this.setState({ list: nextProps.list });
  }

  render() {
    const { colleges, loading } = this.props.college;
    let collegeItems;
    let loadingItem;
    let action;
    let title = <h1 className="display-4 text-center">Colleges</h1>;
    let info = "See all colleges and their informations";

    if (colleges === null || loading) {
      loadingItem = <Spinner />;
    } else {
      if (colleges.length > 0) {
        if (this.props.auth.isAuthenticated) {
          if (this.state.bin) {
            // College Bin
            collegeItems = colleges.map(college =>
              college.deleted === 1 ? (
                this.state.list ? (
                  <CollegeItemGrid key={college._id} college={college} />
                ) : (
                  <CollegeItem key={college._id} college={college} />
                )
              ) : (
                ""
              )
            );
            title = (
              <h1 className="display-4 text-danger text-center">College Bin</h1>
            );

            info = "List of Deactivated Colleges";
          } else {
            // College list
            collegeItems = colleges.map(college =>
              college.deleted === 0 ? (
                this.state.list ? (
                  <CollegeItemGrid key={college._id} college={college} />
                ) : (
                  <CollegeItem key={college._id} college={college} />
                )
              ) : (
                ""
              )
            );
            title = <h1 className="display-4 text-center">Colleges</h1>;
            info = "See all colleges and their informations";
          }
        } else {
          // College list not logged in
          collegeItems = colleges.map(college =>
            college.deleted === 0 ? (
              this.state.list ? (
                <CollegeItemGrid key={college._id} college={college} />
              ) : (
                <CollegeItem key={college._id} college={college} />
              )
            ) : (
              ""
            )
          );
          title = <h1 className="display-4 text-center">Colleges</h1>;
          info = "See all colleges and their informations";
        }
      } else {
        collegeItems = <h4>No colleges found</h4>;
      }
    }

    // if (this.props.auth.isAuthenticated) {
    //   action = <CollegesActions />;
    // }
    action = <CollegesActions />;
    return (
      <div className="colleges">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {title}
              <p className="lead text-center">{info}</p>
              {action}
              <br />
              {loadingItem}
              <div className="row">{collegeItems}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Colleges.propTypes = {
  getColleges: PropTypes.func.isRequired,
  getCollegeByInitials: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
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
  { getColleges, getCollegeByInitials }
)(Colleges);
