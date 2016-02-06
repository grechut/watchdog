import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-mdl/lib/Layout';
import Spinner from 'react-mdl/lib/Spinner';
import IconButton from 'react-mdl/lib/IconButton';
import Menu, { MenuItem } from 'react-mdl/lib/Menu';
import Constants from '../constants';
import AuthActions from '../actions/auth';

class AuthNavigation extends Component {
  render() {
    const { dispatch, auth } = this.props;
    let navigation;

    switch (auth.state) {
      case Constants.AUTH_SIGN_IN_PENDING:
        navigation = (
          <Spinner singleColor />
        );
        break;
      case Constants.AUTH_SIGNED_IN:
        navigation = (<Navigation>
          <img
            className="avatar"
            src={auth.avatarUrl}
          />
          <span>{auth.email}</span>
          <div className="auth-drop-down-menu">
            <IconButton name="arrow_drop_down" id="auth-menu" />
            <Menu target="auth-menu" align="right">
              <MenuItem onClick={() => dispatch(AuthActions.signOut())}>
                Sign out
              </MenuItem>
            </Menu>
          </div>
        </Navigation>);
        break;
      default:
        navigation = (<Navigation>
          <a
            href="#"
            className="mdl-navigation__link"
            onClick={() => dispatch(AuthActions.signIn())}
          >
            Sign in
          </a>
        </Navigation>);
        break;
    }

    return (
      <div>{navigation}</div>
    );
  }
}

AuthNavigation.propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(AuthNavigation);
