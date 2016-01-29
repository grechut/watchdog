import Constants from '../constants';

const Actions = {
  startMotionDetection() {
    return (dispatch) => {
      // TODO: initialize and start motion detection (figure out how to pass custom config)
      // TODO: set detectors object - "motion" and "noise"
      // TODO: toggle isDetectingMotion flag

      dispatch({
        type: Constants.START_MOTION_DETECTION,
      });
    };
  },
};

export default Actions;
