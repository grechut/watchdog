import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import { FABButton, Icon } from 'react-mdl/lib';
import { List, ListItem, ListItemContent } from 'react-mdl/lib/List';
import { Link } from 'react-router';
import _ from 'lodash';
import DeviceActions from '../actions/devices';
import PageActions from '../actions/page';

class DeviceList extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(PageActions.updateTitle('Devices'));
    // TODO: move to onEnter/aync-props
    dispatch(DeviceActions.bindToDevices());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    // TODO: move to onLeave
    dispatch(DeviceActions.unbindFromDevices());
  }

  render() {
    const { dispatch, devices } = this.props;

    // TODO: convert to component
    return (
      <div>
        {(() => {
          if (Object.keys(devices).length) {
            return (
              <List>
                {_.values(devices).map((device) =>
                  (
                    <ListItem key={device.uid}>
                      <ListItemContent>
                        <Link to={`/devices/${device.uid}`}>{device.name}</Link>
                      </ListItemContent>
                    </ListItem>
                  )
                )}
              </List>
            );
          }

          return (
            <List>
              <ListItem>
                <ListItemContent>
                  You don't have any devices yet.
                </ListItemContent>
              </ListItem>
            </List>
          );
        })()}

        <FABButton colored ripple onClick={() => dispatch(routeActions.push('/devices/new'))}>
          <Icon name="add" />
        </FABButton>
      </div>
    );
  }
}

DeviceList.propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  devices: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    devices: state.devices,
  };
}

export default connect(mapStateToProps)(DeviceList);
