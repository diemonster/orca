import { combineReducers } from 'redux';
import authReducer from './authReducer';
import configReducer from './configReducer';
import k8sReducer from './k8sReducer';
import namespaceReducer from './namespaceReducer';
import rolebindingReducer from './rolebindingReducer';


const rootReducer = combineReducers({
  auth: authReducer,
  config: configReducer,
  k8s: k8sReducer,
  namespace: namespaceReducer,
  rolebinding: rolebindingReducer,
});

export default rootReducer;
