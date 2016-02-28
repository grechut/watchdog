import React, { Component, PropTypes } from 'react';
import Switch from 'react-mdl/lib/Switch';

export default class PushNotificationSwitch extends Component {
  render() {
    const { checked, disabled, onChange } = this.props;

    return (
      <Switch ripple
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="btn btn-success"
      >
        Enable push notifications
      </Switch>
    );
  }
}

PushNotificationSwitch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
