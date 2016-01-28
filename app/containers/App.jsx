import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Header, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';

class App extends React.Component {
  render() {
    const page = this.props.page;

    return (
      <Layout>
        <Header title={page.title} className="mdl-typography--text-uppercase"/>
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
  children: PropTypes.object,
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    page: state.page,
  };
}


export default connect(mapStateToProps)(App);
