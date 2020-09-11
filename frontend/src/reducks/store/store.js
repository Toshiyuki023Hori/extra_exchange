// import { createStore, applyMiddleware } from 'redux';
// import { reducer } from '../auth/reducers';
// import thunk from 'redux-thunk';
// import createSagaMiddleWare from 'redux-saga';

// // middlewareを使うにはcreatestoreの第二引数(enhancer)を設定しなければいけない。
// const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default function configureStore() {
//   const sagaMiddleware = createSagaMiddleWare();
//   const store = createStore(reducer, composeEnhances(applyMiddleware(sagaMiddleware, thunk)));
//   sagaMiddleware.run(rootSaga);
//   return store;
// }