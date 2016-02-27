import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Layout, HeaderRow, Content } from 'react-mdl/lib/Layout';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import IconButton from 'react-mdl/lib/IconButton';
import AuthNavigation from '../containers/AuthNavigation';

class LayoutContainer extends React.Component {
  render() {
    const { children, page } = this.props;

    return (
      <Layout fixedHeader>
        <header className="mdl-layout__header is-casting-shadow">
          <IconButton
            name="arrow_back"
            className="mdl-layout-icon"
            ripple
            onClick={ () => browserHistory.goBack() }
          />
          <HeaderRow title={page.title}>
            <AuthNavigation />
          </HeaderRow>
        </header>
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
};

function mapStateToProps(state) {
  return {
    page: state.page,
  };
}

export default connect(mapStateToProps)(LayoutContainer);
