import React, { PropTypes } from 'react';
import Constants from '../constants';
import Avatar from '../components/Avatar';

export default function User(props) {
  const { auth } = props;

  if (auth.state !== Constants.AUTH_SIGNED_IN) {
    return null;
  }

  return (
    <div className="user">
      <Avatar src={auth.avatarUrl} />
      <h6>{auth.email}</h6>
    </div>
  );
}

User.propTypes = {
  auth: PropTypes.object,
};
