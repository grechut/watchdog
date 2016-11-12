import React, { PropTypes } from 'react';
import Icon from 'react-mdl/lib/Icon';
import classnames from 'classnames';

export default class Video extends React.Component {
  componentDidMount() {
    this.setSource();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.src !== this.props.src;
  }

  componentDidUpdate() {
    this.setSource();
  }

  setSource() {
    const { src } = this.props;
    const video = this.videoEl;

    if (src) {
      video.setAttribute('autoplay', true);
      video.src = window.URL.createObjectURL(src);
      video.play();
    }
  }

  render() {
    const { muted, src } = this.props;
    const classes = classnames('video', {
      'video-on': src,
      'video-off': !src,
    });

    return (
      <div className={classes}>
        {src ? (
          <video muted={muted} ref={(c) => { this.videoEl = c; }} />
          ) : (
          <Icon name="videocam_off" />
        )}
      </div>
    );
  }
}

Video.propTypes = {
  src: PropTypes.object,
  muted: PropTypes.bool,
};
