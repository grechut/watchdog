import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FABButton, Icon } from 'react-mdl/lib';
import PageActions from '../actions/page';
import { routeActions } from 'react-router-redux';

class DeviceList extends React.Component {
  componentDidMount() {
    this.props.dispatch(PageActions.updateTitle('Devices'));
  }

  render() {
    const { dispatch } = this.props;

    return (
      <div>
        <ul className="demo-list-item mdl-list">
          <li className="mdl-list__item">
            <span className="mdl-list__item-primary-content">
              Bryan Cranston
            </span>
          </li>
        </ul>

        <FABButton colored ripple
          onClick={() => dispatch(routeActions.push('/devices/new'))}
        >
          <Icon name="add" />
        </FABButton>
      </div>
    );
  }
}

DeviceList.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(DeviceList);
