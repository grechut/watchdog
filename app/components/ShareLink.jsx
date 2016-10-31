import React, { PropTypes } from 'react';
import { IconButton } from 'react-mdl/lib';
import CopyToClipboard from 'react-copy-to-clipboard';

function ShareLink(props) {
  const { link } = props;
  const onCopy = () => console.log('Copied', link);

  return (
    // TODO maybe add notifications like:
    // https://www.npmjs.com/package/react-notifications
    <CopyToClipboard text={link} onCopy={onCopy}>
      <IconButton name="share" title="Share" />
    </CopyToClipboard>
  );
}

ShareLink.propTypes = {
  link: PropTypes.string,
};

export default ShareLink;
