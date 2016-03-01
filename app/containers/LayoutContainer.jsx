import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Layout, Content, Drawer, Navigation, Header } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import IconButton from 'react-mdl/lib/IconButton';
import User from '../components/User';
import SignInSignOut from '../components/SignInSignOut';

class LayoutContainer extends React.Component {
  render() {
    const { children, dispatch, page, auth } = this.props;

    return (
      <Layout fixedHeader>
        <Header title={page.title}>
          {/* TODO Probably not needed once we have hamburger menu
          <IconButton
            name="arrow_back"
            className="mdl-layout-icon"
            ripple
            onClick={ () => browserHistory.goBack() }
          />*/}
        </Header>
        <Drawer fixedDrawer>
            <Navigation>
              <User auth={auth} />
              <Link to="/devices">Devices</Link>
              <SignInSignOut
                auth={auth}
                dispatch={dispatch}
              />
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
}

LayoutContainer.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  page: PropTypes.object,
  auth: PropTypes.auth,
};

function mapStateToProps(state) {
  return {
    page: state.page,
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(LayoutContainer);
