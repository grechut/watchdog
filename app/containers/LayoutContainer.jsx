import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Layout, Content, Drawer, Navigation, Header } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import AuthActions from 'actions/auth';

import User from 'components/User';

export default function LayoutContainer(props) {
  const { children, dispatch, auth, title } = props;

  return (
    <Layout fixedHeader fixedDrawer>
      <Header title={title} />
      <Drawer className="mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
          <header className="drawer-header">
            <User auth={auth} />
          </header>
          <Navigation className="drawer-navigation mdl-color--blue-grey-800">
            <Link to="/devices">Devices</Link>
            <a href="#" onClick={() => dispatch(AuthActions.signOut())}>Sign out</a>
          </Navigation>
        </Drawer>
      <Content>
        <Grid className="content">
          <Cell col={8} tablet={12} align="middle">
            {children}
          </Cell>
        </Grid>
      </Content>
    </Layout>
  );
}

LayoutContainer.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  title: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(LayoutContainer);
