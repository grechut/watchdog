import Firebase from 'firebase';
import Constants from '../constants';
import { routeActions } from 'react-router-redux';

const ref = new Firebase(process.env.FIREBASE_URL);

const Actions = {
  listen() {
    return (dispatch, getState) => {
      const state = getState();

      ref.onAuth((authData) => {
        if (authData) {
          // Save user to Firebase
          const userRef = ref.child(`users/${authData.uid}`);
          userRef.update({
            uid: authData.uid,
            name: authData.google.displayName,
            email: authData.google.email,
            avatarUrl: authData.google.profileImageURL,
          });

          dispatch({
            type: Constants.AUTH_SIGN_IN,
            payload: { authData },
          });
        } else {
          if (state.auth.state !== Constants.AUTH_SIGNED_OUT) {
            dispatch({
              type: Constants.AUTH_SIGN_OUT,
              payload: { authData },
            });
          }
        }
      });
    };
  },

  signIn() {
    return (dispatch) => {
      dispatch({
        type: Constants.AUTH_SIGN_IN_PENDING,
      });

      ref.authWithOAuthPopup('google', (error) => {
        if (error) {
          return dispatch({
            type: Constants.AUTH_SIGN_IN_FAILURE,
            payload: { error },
          });
        }

        return dispatch(routeActions.push('/devices'));
      }, {
        scope: 'email',
      });
    };
  },

  signOut() {
    return (dispatch) => {
      dispatch({
        type: Constants.AUTH_SIGN_OUT,
      });
      ref.unauth();
      return dispatch(routeActions.push('/'));
    };
  },
};

export default Actions;
