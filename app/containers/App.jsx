import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Header, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Header title="Watchdog" />
        <Content>
          <Grid className="content">
            <Cell col={12} align="middle" className="mdl-typography--text-center">
              {this.props.children}
            </Cell>
          </Grid>
        </Content>
      </Layout>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  children: PropTypes.object,
};

export default connect()(App);
