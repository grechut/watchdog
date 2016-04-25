import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import AuthActions from 'actions/auth';

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(AuthActions.listen());
  }

  render() {
    const { children } = this.props;

    return (
      <div>{children}</div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect()(App);
