import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer'

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension && window.devToolsExtension()
  ));

import ViewComp from './view';

ReactDOM
  .render(
    <Provider store={store}>
      <ViewComp />
    </Provider>,
    document.getElementById('root')
  );
