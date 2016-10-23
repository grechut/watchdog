import { routeActions } from 'react-router-redux';
import Constants from '../constants';
import firebase, { rootRef } from '../lib/firebase';

const Actions = {
  listen() {
    return (dispatch, getState) => {
      const state = getState();

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // Save user to Firebase
          const userRef = rootRef.child(`users/${user.uid}`);

          userRef.update({
            uid: user.uid,
            name: user.providerData[0].displayName,
            email: user.providerData[0].email,
            avatarUrl: user.providerData[0].photoURL,
          });

          dispatch({
            type: Constants.AUTH_SIGN_IN,
            payload: { user },
          });
        } else if (state.auth.state !== Constants.AUTH_SIGNED_OUT) {
          dispatch({
            type: Constants.AUTH_SIGN_OUT,
            payload: { user },
          });

          dispatch(routeActions.push('/'));
        }
      });
    };
  },

  signIn(returnToPath) {
    return (dispatch) => {
      dispatch({
        type: Constants.AUTH_SIGN_IN_PENDING,
      });

      const defaultPath = '/devices';
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');

      firebase.auth().signInWithPopup(provider)
        .then(() => dispatch(routeActions.push(returnToPath || defaultPath)))
        .catch(error =>
          dispatch({
            type: Constants.AUTH_SIGN_IN_FAILURE,
            payload: { error },
          })
        );
    };
  },

  signOut() {
    return (dispatch) => {
      dispatch({
        type: Constants.AUTH_SIGN_OUT,
      });
      firebase.auth().signOut();

      return dispatch(routeActions.push('/'));
    };
  },
};

export default Actions;
