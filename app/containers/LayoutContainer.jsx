import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Header, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import AuthNavigation from '../containers/AuthNavigation';
import { extractRouteName } from '../utils/extractRouteName';

const LAYOUT_CONFIG = {
  devicesList: {
    title: 'Your devices',
  },
  newDevice: {
    title: 'Add a device',
  },
  device: {
    title: 'Device',
  },
};

class LayoutContainer extends React.Component {
  render() {
    const { children, pathname } = this.props;
    const layoutConfig = LAYOUT_CONFIG[extractRouteName(pathname)] || {};

    return (
      <Layout>
        <Header title={layoutConfig.title}>
          <AuthNavigation />
        </Header>
        <Content>
          <Grid className="content">
            <Cell col={12} align="middle">
              {children}
            </Cell>
          </Grid>
        </Content>
      </Layout>
    );
  }
}

LayoutContainer.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  pathname: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    pathname: state.routing.location.pathname,
    page: state.page,
  };
}

export default connect(mapStateToProps)(LayoutContainer);
