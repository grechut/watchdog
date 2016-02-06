import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Header, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import AuthActions from '../actions/auth';
import AuthNavigation from '../containers/AuthNavigation';

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(AuthActions.listen());
  }

  render() {
    const { children, page } = this.props;

    return (
      <Layout>
        <Header title={page.title} className="mdl-typography--text-uppercase">
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

App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    page: state.page,
  };
}

export default connect(mapStateToProps)(App);
