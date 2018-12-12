import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/rootReducer';
import authMiddleware from '../middleware/authMiddleware';
import k8sMiddleware from '../middleware/k8sMiddleware';
import errorMiddleware from '../middleware/errorMiddleware';


export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, authMiddleware, errorMiddleware, k8sMiddleware),
  );
}
