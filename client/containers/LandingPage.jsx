import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Content } from 'react-mdl/lib/Layout';
import { Button } from 'react-mdl/lib';

import AuthActions from '../actions/auth';

function LandingPage(props) {
  const { dispatch, location } = props;
  const returnToParam = location.query['return-to'];
  const returnToPath = returnToParam ? decodeURIComponent(returnToParam) : null;

  return (
    <Layout>
      <Content>
        <div className="landing-page">
          <a
            href="https://github.com/grechut/watchdog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
              src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
              alt="Fork me on GitHub"
              data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
            />
          </a>

          <h2>WATCHDOG</h2>
          <h5>Live motion and audio alerts</h5>
          <Button
            onClick={() => dispatch(AuthActions.signIn(returnToPath))}
            raised
            colored
          >
            LAUNCH
          </Button>
        </div>
      </Content>
    </Layout>
  );
}

LandingPage.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
};

export default connect()(LandingPage);
