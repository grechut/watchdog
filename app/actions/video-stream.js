import Rx from 'rxjs/Rx';
import moment from 'moment';
import Constants from '../constants';
import detectors from '../lib/detectors';
import MotionDetector from '../lib/detectors/motion';
import PushNotificationActions from '../actions/push-notification';

const Actions = {
  getLocalVideoStream() {
    return (dispatch, getState) => {
      const constraints = { video: true, audio: true };
      const gotStream = function (stream) {
        dispatch({
          type: Constants.VIDEO_STREAM_GET_LOCAL,
          stream,
        });

        // TODO: move it somewhere else and dispatch action to update state
        const motionDetector = new MotionDetector(stream);
        const windowDuration = 30000; // 30 seconds
        const source = new Rx.Subject();
        const deviceId = getState().device.owner;

        // Notify when motion has started
        const next = source
          .debounceTime(windowDuration)
          .switchMap(() => source.take(1));

        Rx.Observable.merge(source.take(1), next)
          .subscribe((data) => {
            const message = `Motion started at ${time(data.triggeredAt)}`;
            console.log(message);
            dispatch(PushNotificationActions.send(deviceId, message));
          });

        // Notify when motion has stopped
        source
          .debounceTime(windowDuration)
          .subscribe((data) => {
            const message = `Motion stopped at ${time(data.triggeredAt)}`;
            console.log(message);
            dispatch(PushNotificationActions.send(deviceId, message));
          });

        // Proxy events to source observable when motion is detected
        motionDetector.onEvent = (data) => {
          data.triggeredAt = Date.now();
          source.next(data);
          console.log('motion detected', data);
        };

        motionDetector.start();
        detectors.motion = motionDetector;

        function time(timestamp) {
          return moment(timestamp).format('hh:mm:ss.SS');
        }

        dispatch({
          type: Constants.CHANGE_DETECTOR,
        });
      };
      const gotError = function (error) {
        console.error(error);
      };
      navigator.getUserMedia = navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia;

      return navigator.getUserMedia(constraints, gotStream, gotError);
    };
  },
};

export default Actions;
