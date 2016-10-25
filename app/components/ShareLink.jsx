import React, { PropTypes } from 'react';
import { IconButton } from 'react-mdl/lib';
import CopyToClipboard from 'react-copy-to-clipboard';

function ShareLink(props) {
  const { link } = props;

  return (
    <CopyToClipboard
      text={link}
      /* TODO maybe add notifications like:
        https://www.npmjs.com/package/react-notifications */
      onCopy={() => console.log('Copied')}
    >
      <IconButton name="share" />
    </CopyToClipboard>
  );
}

ShareLink.propTypes = {
  link: PropTypes.string,
};

export default ShareLink;

