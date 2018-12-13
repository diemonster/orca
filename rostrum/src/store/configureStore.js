import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/rootReducer';
import authMiddleware from '../middleware/authMiddleware';
import k8sMiddleware from '../middleware/k8sMiddleware';
import errorMiddleware from '../middleware/errorMiddleware';


// Actions are passed through multiple middlewares in the order
// in which they are specified in applyMiddleware. Since we want
// to gate actions behind authentication, we want to make sure
// that authMiddleware is the first of our middlewares through
// which actions will filter.
export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, authMiddleware, errorMiddleware, k8sMiddleware),
  );
}
