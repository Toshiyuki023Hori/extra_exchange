import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
// import 'ress'

import reducer from '../src/reducks/auth/reducers';

// redux-persistの設定
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['uid', 'token'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// middlewareを使うにはcreatestoreの第二引数(enhancer)を設定しなければいけない。
const store = createStore(persistedReducer, composeEnhances(applyMiddleware(thunk)));

const persistor = persistStore(store);
export default store;

const app = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <App />
    </PersistGate>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
