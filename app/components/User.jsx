import React, { PropTypes } from 'react';
import Constants from '../constants';

export default function User(props) {
  const { auth } = props;

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

User.propTypes = {
  auth: PropTypes.object,
};
