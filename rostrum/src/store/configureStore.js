import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/rootReducer';

import k8sMiddleware from '../middleware/k8s/middleware';
import errorMiddleware from '../middleware/errors/middleware';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, k8sMiddleware, errorMiddleware),
  );
}
