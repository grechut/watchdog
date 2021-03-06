import React, { PropTypes } from 'react';

export default function Avatar(props) {
  const { src } = props;

  return (
    <img
      alt="avatar"
      className="user__avatar"
      src={src}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
};
