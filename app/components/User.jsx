import React, { Component, PropTypes } from 'react';
import Constants from '../constants';

export default class User extends Component {
  render() {
    const { auth } = this.props;

    if (auth.state !== Constants.AUTH_SIGNED_IN) {
      return null;
    }

    return (
      <div className="user">
        <img
          className="user__avatar"
          src={auth.avatarUrl}
        />
        <h6>{auth.email}</h6>
      </div>
    );
  }
}

User.propTypes = {
  auth: PropTypes.object,
};
