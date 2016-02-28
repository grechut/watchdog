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
    const stream = this.props.src;
    const video = this.refs.video;

    if (stream) {
      video.setAttribute('autoplay', true);
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }
  }

  render() {
    const src = this.props.src;
    const classes = classnames('video', {
      'video-on': src,
      'video-off': !src,
    });

    return (
      <div className={classes}>
        {
          src ?
            <video ref="video"></video>
          :
            <Icon name="videocam_off" />
        }
      </div>
    );
  }
}

Video.propTypes = {
  src: PropTypes.object,
};
