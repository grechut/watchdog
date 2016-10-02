import SimplePeer from 'simple-peer';

import { rootRef } from '../lib/firebase';

import Constants from '../constants';

const Actions = {
  // TODO: wait till device is online before trying to connect
  connectToDevice(deviceId) {
    return (dispatch, getState) => {
      // This is required to send media stream to connection initiator. Because
      // initiator is not sending any media stream, without these contraints
      // 'stream' event will never fire.
      const offerConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      const { peer, devices } = getState();
      const device = devices[deviceId];
      const signalingRef = rootRef.child('webrtc/messages');
      const connection = new SimplePeer({
        initiator: true,
        offerConstraints,
      });
      const me = peer.id;
      const to = device.peerId;

      console.log(`WebRTC: connecting to device ${deviceId}...`);

      setupConnection(connection, { from: me, to });

      connection.on('stream', (stream) => {
        console.log('WebRTC: media stream received', stream);

        dispatch({
          type: Constants.MEDIA_STREAM_SET_REMOTE,
          payload: { deviceId, stream },
        });
      });

      // Remove any pending signaling messages sent to this peer when
      // connection with Firebase is lost.
      signalingRef.child(me).onDisconnect().remove();

      // Listen to incoming signaling messages
      signalingRef.child(me).on('child_added', (snapshot) => {
        const message = snapshot.val();

        console.log('WebRTC: signal received', message);

        // Remove message now that it's fetched
        snapshot.ref.remove();

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
      const signalingRef = rootRef.child('webrtc/messages');
      const connections = {};
      const me = peer.id;

      // Remove any pending signaling messages sent to this peer when
      // connection with Firebase is lost.
      signalingRef.child(me).onDisconnect().remove();

      // Listen for incoming signaling messages
      signalingRef.child(me).on('child_added', (snapshot) => {
        const message = snapshot.val();
        const to = message.senderPeerId;
        let connection = connections[to];

        console.log('WebRTC: signal received', message);

        if (!connection) {
          connection = connections[to] = new SimplePeer({
            initiator: false,
            stream: device.localStream,
          });

          setupConnection(connection, { from: me, to });

          // Delete connection from the list when it's closed or there's an error
          connection.once('close', onClose);
          connection.on('error', onClose);
        }

        // Remove message now that it's fetched
        snapshot.ref.remove();

        connection.signal(message.payload);

        function onClose() {
          if (connections[to] === connection) {
            delete connections[to];
          }
        }
      });
    };
  },
};

function setupConnection(connection, { from, to }) {
  const signalingRef = rootRef.child('webrtc/messages').child(to);

  connection.on('connect', () => {
    console.log(`WebRTC: connected to ${to}`);
  });

  // Send generated WebRTC signaling messages to the other peer
  connection.on('signal', (data) => {
    console.log('WebRTC: signal generated', data);

    // Send signaling data to the other peer
    signalingRef.push({
      senderPeerId: from,
      recipientPeerId: to,
      payload: data,
    });
  });

  connection.once('close', () => {
    console.log('WebRTC: close');
    connection.destroy();
  });

  connection.on('error', (error) => {
    console.warn('WebRTC: error', error);
    connection.destroy();
  });

  // Remove any pending signaling messages sent to other peers when
  // connection with Firebase is lost.
  signalingRef.onDisconnect().remove();
}

export default Actions;
