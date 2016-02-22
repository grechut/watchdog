import SimplePeer from 'simple-peer';
import firebase from '../lib/firebase';
import Constants from '../constants';

const Actions = {
  // TODO: wait till device is online before trying to connect
  connectToDevice(deviceId) {
    return (dispatch, getState) => {
      const offerConstraints = {
        optional: [],
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
      };
      const { peer, devices } = getState();
      const device = devices[deviceId];
      const signalingRef = firebase.child('webrtc/messages');
      const connection = new SimplePeer({
        initiator: true,
        offerConstraints,
      });

      console.log('WebRTC: connecting...');

      // TODO: move to a function and use for initiator as well
      connection.on('connect', () => {
        console.log('WebRTC: connected');
      });

      connection.on('error', (error) => {
        console.warn('WebRTC: error', error);
      });

      connection.on('signal', (data) => {
        console.log('WebRTC: signal generated', data);

        // Send signaling data to the other peer
        signalingRef.child(device.peerId).push({
          senderPeerId: peer.id,
          recipientPeerId: device.peerId,
          payload: data,
        });
      });

      connection.on('stream', (stream) => {
        console.log('WebRTC: media stream received', stream);

        dispatch({
          type: Constants.VIDEO_STREAM_SET_REMOTE,
          payload: {
            deviceId,
            stream,
          },
        });
      });

      signalingRef.child(peer.id).on('child_added', (snapshot) => {
        const message = snapshot.val();

        console.log('WebRTC: signal received', message);

        connection.signal(message.payload);
      });
    };
  },

  // TODO: wait till stream is available before connecting. currently we're requesting
  // video stream (async operation) and here we assume it's already available,
  // but doesn't have to be
  listen(deviceId) {
    return (dispatch, getState) => {
      console.log('WebRTC: listening for incoming connections...');

      const { peer, devices } = getState();
      const device = devices[deviceId];
      const signalingRef = firebase.child('webrtc/messages');
      const connections = {};

      // Remove WebRTC messages sent to this peer when it disconnects from Firebase
      signalingRef.onDisconnect().remove();

      // Listen for incoming WebRTC messages from other peers
      signalingRef.child(peer.id).on('child_added', (snapshot) => {
        const message = snapshot.val();
        const remoteId = message.senderPeerId;
        let connection = connections[remoteId];

        console.log('WebRTC: signal received', message);

        if (!connection) {
          connection = connections[remoteId] = new SimplePeer({
            initiator: false,
            stream: device.localStream,
          });

          // Listen for local ICE/SDP messages
          // TODO: move to a function and use for initiator as well
          connection.on('signal', (data) => {
            console.log('WebRTC: signal generated', data);

            // Send signaling data to the other peer
            signalingRef.child(remoteId).push({
              senderPeerId: peer.id,
              recipientPeerId: remoteId,
              payload: data,
            });
          });

          connection.on('connect', () => {
            console.log('WebRTC: connected');
          });

          connection.on('error', (error) => {
            console.warn('WebRTC: error', error);
          });

          connection.once('close', () => {
            console.log('WebRTC: close');
          });
        }

        // Set remote ICE/SDP message
        connection.signal(message.payload);
      });
    };
  },
};

export default Actions;
