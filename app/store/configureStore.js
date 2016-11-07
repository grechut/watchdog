import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistory, routeReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from '../reducers';

const reduxRouterMiddleware = syncHistory(browserHistory);
const loggerMiddleware = createLogger();
const middlewares = applyMiddleware(
  reduxRouterMiddleware, // Sync dispatched route actions to the history
  thunkMiddleware,       // Lets us dispatch() functions
  loggerMiddleware,      // Logs all actions to the console
);
const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer,
}));

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, compose(
    middlewares,
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ));

  // Required for replaying actions from devtools to work
  reduxRouterMiddleware.listenForReplays(store);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers'); // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
