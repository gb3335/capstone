
import React, { Component } from "react";
import { connect } from "react-redux";

import './ViewUsers.css';


class ViewUsers extends Component {

  constructor() {
    super();
    this.state = {

    };
  }






  render() {

    return (


      <div className="profiles">

        <div className="row" style={{ margin: "5px" }}>
          <div className="col-md-12">
            <div className="usersBg ">
              <div className="light-overlay p-2">
                <div className="display-4 text-center mb-1">Users
                <p className="lead text-center ">
                    To do UserLogs
                </p>

                </div>
              </div>
            </div>
            <br />
            {/* <RegisterActions />
            {userItems} */}
          </div>
        </div>
      </div>




    )
  }
}

ViewUsers.protoTypes = {

}

const mapStateToProps = state => ({


})

export default connect(null, null)(ViewUsers);