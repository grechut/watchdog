import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Header, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import AuthNavigation from '../containers/AuthNavigation';

class LayoutContainer extends React.Component {
  render() {
    const { children, page } = this.props;

    return (
      <Layout>
        <Header title={page.title}>
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
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    page: state.page,
  };
}

export default connect(mapStateToProps)(LayoutContainer);
