import React, { Component, PropTypes } from 'react';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import Switch from 'react-mdl/lib/Switch';

export default class PushNotificationSwitch extends Component {
  render() {
    const { checked, disabled, onChange } = this.props;

    return (
      <Grid>
        <Cell col={10}>
          <label htmlFor="toggle-push-notifications">
            <span className="mdl-switch__label">
              Enable push notifications
            </span>
          </label>
        </Cell>
        <Cell col={2}>
          <Switch ripple
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="btn btn-success"
            id="toggle-push-notifications"
          />
        </Cell>
      </Grid>
    );
  }
}

PushNotificationSwitch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
