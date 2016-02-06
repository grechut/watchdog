import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import AuthActions from '../actions/auth';

class LandingPage extends React.Component {
  render() {
    const { dispatch } = this.props;

    return (
      <Layout>
        <Content>
          <Grid>
            <Cell col={12} align="middle">
              <a
                href="#"
                onClick={() => dispatch(AuthActions.signIn())}
              >
                Get started
            </a>
            </Cell>
          </Grid>
        </Content>
      </Layout>
    );
  }
}

LandingPage.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(LandingPage);
