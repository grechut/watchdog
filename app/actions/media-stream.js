import Rx from 'rxjs/Rx';
import moment from 'moment';

import detectors from '../lib/detectors';
import MotionDetector from '../lib/detectors/motion';
import NoiseDetector from '../lib/detectors/noise';

import Constants from '../constants';

import PushNotificationActions from '../actions/push-notification';

const Actions = {
  getLocalMediaStream(deviceId) {
    return (dispatch) => {
      const constraints = { video: true, audio: true };
      const gotStream = (stream) => {
        dispatch({
          type: Constants.MEDIA_STREAM_SET_LOCAL,
          payload: {
            deviceId,
            stream,
          },
        });

        const motionDetector = new MotionDetector(stream);
        const noiseDetector = new NoiseDetector(stream);

        // TODO: change it to something that can register a detector
        detectors.motion = motionDetector;
        detectors.noise = noiseDetector;

        setupDetector(motionDetector, {
          onStart: (data) => {
            const code = 'motion_started';
            const message = `Motion started at ${time(data.triggeredAt)}`;
            const payload = {
              code,
              message,
              triggeredAt: data.triggeredAt,
            };

            dispatch(PushNotificationActions.send(deviceId, payload));
          },
          onStop: (data) => {
            const code = 'motion_stopped';
            const message = `Motion stopped at ${time(data.triggeredAt)}`;
            const payload = {
              code,
              message,
              triggeredAt: data.triggeredAt,
            };

            dispatch(PushNotificationActions.send(deviceId, payload));
          },
        });

        setupDetector(noiseDetector, {
          onStart: (data) => {
            const code = 'noise_started';
            const message = `Noise started at ${time(data.triggeredAt)}`;
            const payload = {
              code,
              message,
              triggeredAt: data.triggeredAt,
            };

            dispatch(PushNotificationActions.send(deviceId, payload));
          },
          onStop: (data) => {
            const code = 'noise_stopped';
            const message = `Noise stopped at ${time(data.triggeredAt)}`;
            const payload = {
              code,
              message,
              triggeredAt: data.triggeredAt,
            };

            dispatch(PushNotificationActions.send(deviceId, payload));
          },
        });

        motionDetector.start();
        noiseDetector.start();

        dispatch({
          type: Constants.CHANGE_DETECTOR,
        });
      };

      const gotError = (error) => {
        console.error(error);
      };

      navigator.getUserMedia = navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia;

      return navigator.getUserMedia(constraints, gotStream, gotError);
    };
  },
};

function setupDetector(detector, { onStart, onStop, windowDuration = 10000 }) {
  const source = new Rx.Subject();

  // Notify when motion has started
  const next = source
    .debounceTime(windowDuration)
    .switchMap(() => source.take(1));

  Rx
    .Observable
    .merge(source.take(1), next)
    .subscribe(onStart);

  // Notify when motion has stopped
  source
    .debounceTime(windowDuration)
    .subscribe(onStop);

  /* eslint no-param-reassign: 0 */
  // TODO change to event emitter (or use RxJS)
  detector.onEvent = (event) => {
    const data = { ...event, triggeredAt: Date.now() };
    source.next(data);
    // console.log('event detected', data);
  };
}

function time(timestamp) {
  return moment(timestamp).format('HH:mm:ss');
}

export default Actions;
