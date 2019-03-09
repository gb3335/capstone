import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty'
import Image from 'react-image-resizer';

class UserItems extends Component {
  render() {
    const { user } = this.props;

    return (
      <div className="card card-body bg-light mn-3">
        <div className="row">
          <div className="col-2">
            <img src={user.avatar} alt="" className="rounded-circle  w-100 " />
          </div>
          <h3 className="">Name: {user.name.firstName} {user.name.lastName}</h3>

        </div>

      </div>
    )
  }
}
UserItems.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserItems
