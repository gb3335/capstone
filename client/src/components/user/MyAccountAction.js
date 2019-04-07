
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageFieldGroup from "../common/ImageFieldGroup";
import { changeStatus, changeAvatar, createReportForUser } from '../../actions/registerActions';
import SweetAlert from "react-bootstrap-sweetalert";

class MyAccountAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Delete Alert
      generateAlert: false,
      image: "",
      images: []
    };
  }
  onFileSelected = e => {
    const files = e.target.files;
    const len = files.length;
    let i = 0;
    let ctr = 0;
    let upImages;

    let currentLink = window.location.href;
    let firstOccurencePath;
    let firstOccurence = currentLink.indexOf("/");
    firstOccurencePath = currentLink.substring(firstOccurence + 1, currentLink.length);
    let secondOccurencePath;
    let secondOccurence = firstOccurencePath.indexOf("/");
    secondOccurencePath = firstOccurencePath.substring(secondOccurence + 1, firstOccurencePath.length);
    let thirdOccurencePath;
    let thirdOccurence = secondOccurencePath.indexOf("/");
    thirdOccurencePath = secondOccurencePath.substring(thirdOccurence + 1, secondOccurencePath.length);



    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = e => {
      this.setState({
        images: [...this.state.images, e.target.result]
      });
      upImages = this.state.images;
      ctr = 1;

      if (ctr === len) {

        const data = {
          images: upImages,
          id: this.props.users.user._id,
          createdBy: this.props.auth.id,
          username: this.props.auth.user.userName ? this.props.auth.user.userName : this.props.auth.user.email,
          oldlink: thirdOccurencePath
        };

        this.props.changeAvatar(data, this.props.history);
        this.setState({
          image: "",
          images: []
        })
      }
    };

  };

  onGenerateReport = () => {
    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    const usersReport = {
      user: this.props.users.user,
      typeOfReport: "User Report",
      printedBy: name
    };

    this.props.createReportForUser(usersReport);

    // show generate alert
    this.setState({ generateAlert: true });


  };


  onGenerateAlert = () => {
    this.setState({ generateAlert: false });

  };
  render() {


    const { user, auth } = this.props

    let oldlink;
    let oldid;
    let currentLink = window.location.href;
    let firstOccurencePath;
    let firstOccurence = currentLink.indexOf("/");
    firstOccurencePath = currentLink.substring(firstOccurence + 1, currentLink.length);
    let secondOccurencePath;
    let secondOccurence = firstOccurencePath.indexOf("/");
    secondOccurencePath = firstOccurencePath.substring(secondOccurence + 1, firstOccurencePath.length);
    let thirdOccurencePath;
    let thirdOccurence = secondOccurencePath.indexOf("/");
    thirdOccurencePath = secondOccurencePath.substring(thirdOccurence + 1, secondOccurencePath.length);
    let fouthOccurencePath;
    let fourthOccurence = thirdOccurencePath.indexOf("/");
    fouthOccurencePath = thirdOccurencePath.substring(fourthOccurence + 1, thirdOccurencePath.length);
    // OLDLINK
    let fifthOccurencePath;
    let fifthOccurence = fouthOccurencePath.indexOf("/");
    fifthOccurencePath = fouthOccurencePath.substring(fifthOccurence + 1, fouthOccurencePath.length);
    //Continuation
    let sixthOccurencePath;
    let sixthOccurence = fifthOccurencePath.indexOf("/");
    sixthOccurencePath = fifthOccurencePath.substring(sixthOccurence + 1, fifthOccurencePath.length);

    let getlink;
    let getoldlinkOccurence = fifthOccurencePath.indexOf("/");
    getlink = fifthOccurencePath.substring(0, getoldlinkOccurence);

    if (sixthOccurencePath.includes("/")) {
      oldlink = `/${fifthOccurencePath}`
    }
    else {
      if (getlink === sixthOccurencePath) {
        oldlink = `/${getlink}`
      }
      else {
        oldlink = `/${getlink}/${sixthOccurencePath}`
      }
    }




    let editAction;
    let imageAction;
    let blockAction;

    if (auth.isAuthenticated) {

      if (user.email === auth.user.email) {
        editAction = (

          <Link to={`/edit-account/${getlink}/${sixthOccurencePath}`} className="btn btn-light"> <i className="fas fa-pen text-info mr-1" />Edit User</Link>




        );
        imageAction = (

          <label to="#" htmlFor="imageUpload" className="btn btn-light">
            <i className="fas fa-circle-notch text-info mr-1" />
            Change avatar
          </label>


        )

      }


    }
    return (
      <div>
        {/* ALERTS */}
        {/* GENERATE REPORT ALERT */}
        <SweetAlert
          show={this.state.generateAlert}
          success
          title="Great!"
          onConfirm={this.onGenerateAlert}
        >
          Please wait for the report to generate
        </SweetAlert>

        <div className="btn-group mb-3 btn-group-sm" role="group">
          {editAction}
        </div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          {blockAction}
        </div>
        <div className="btn-group mb-2 btn-group-sm" role="group">
          {imageAction}
          <ImageFieldGroup
            placeholder="* Images"
            name="image"
            value={this.state.image}
            onChange={this.onFileSelected}
            id="imageUpload"
          />
        </div>
        <div className="btn-group mb-3 btn-group-sm" role="group">
          <Link to="#" onClick={this.onGenerateReport} className="btn btn-light">
            <i className="fas fa-poll-h text-info mr-1" />Create Report
        </Link>
        </div>



      </div>
    );
  }
}

MyAccountAction.propTypes = {
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  changeAvatar: PropTypes.func.isRequired,
  createReportForUser: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { changeStatus, changeAvatar, createReportForUser }
)(withRouter(MyAccountAction));
