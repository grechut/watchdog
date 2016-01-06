import React, { PropTypes } from 'react';

export default class Video extends React.Component {
  componentDidMount() {
    this.setSource();
  }

  componentDidUpdate() {
    this.setSource();
  }

  setSource() {
    const video = this.refs.video;
    const stream = this.props.src;

    if (stream) {
      video.setAttribute('autoplay', true);
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }
  }

  render() {
    if (!this.props.src) { return null; }

    return (
      <video ref="video"></video>
    );
  }
}

Video.propTypes = {
  src: PropTypes.object,
};
