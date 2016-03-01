import React, { Component, PropTypes } from 'react';
import Spinner from 'react-mdl/lib/Spinner';
import Constants from '../constants';
import AuthActions from '../actions/auth';

export default class SignInSignOut extends Component {
  render() {
    const { dispatch, auth } = this.props;
    let content;

    switch (auth.state) {
      case Constants.AUTH_SIGN_IN_PENDING:
        content = (<Spinner singleColor />);
        break;
      case Constants.AUTH_SIGNED_IN:
        content = (<a
          href="#"
          className="mdl-navigation__link"
          onClick={() => dispatch(AuthActions.signOut())}
        >
          Sign out
        </a>);
        break;
      default:
        content = (<a
          href="#"
          className="mdl-navigation__link"
          onClick={() => dispatch(AuthActions.signIn())}
        >
            Sign in
          </a>);
        break;
    }

    return (
      <div>{content}</div>
    );
  }
}

SignInSignOut.propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
};
