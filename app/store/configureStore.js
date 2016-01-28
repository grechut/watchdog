import { combineReducers, createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistory, routeReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducers';

const reduxRouterMiddleware = syncHistory(browserHistory);
const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
  reduxRouterMiddleware, // Sync dispatched route actions to the history
  thunkMiddleware,       // Lets us dispatch() functions
  loggerMiddleware       // Logs all actions to the console
)(createStore);

export default function configureStore(initialState) {
  const appReducer = combineReducers(Object.assign({}, reducers, {
    routing: routeReducer,
  }));
  const store = createStoreWithMiddleware(appReducer, initialState);

  // Required for replaying actions from devtools to work
  reduxRouterMiddleware.listenForReplays(store);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
