import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Content } from 'react-mdl/lib/Layout';
import { Button } from 'react-mdl/lib';
import AuthActions from '../actions/auth';

function LandingPage(props) {
  const { dispatch } = props;

  return (
    <Layout>
      <Content>
        <div className="landing-page">
            <a href="https://github.com/grechut/watchdog"
              target="_blank"
            >
                <img
                  style={{ position: 'absolute', top: '0', right: '0', border: '0' }}
                  src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
                  alt="Fork me on GitHub"
                  data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
                />
            </a>

            <h1>Watchdog</h1>
            <h5>Real-time motion and audio detection on your devices</h5>
            <Button
              href="#"
              onClick={() => dispatch(AuthActions.signIn())}
              raised
              colored
            >
              Get started
            </Button>
        </div>
      </Content>
    </Layout>
  );
}

LandingPage.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(LandingPage);
