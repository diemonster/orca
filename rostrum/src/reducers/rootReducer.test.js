import rootReducer from './rootReducer';
import { initialState as auth } from './authReducer';
import { initialState as config } from './configReducer';
import { initialState as k8s } from './k8sReducer';
import { initialState as namespace } from './namespaceReducer';
import { initialState as rolebinding } from './rolebindingReducer';


describe('root reducer', () => {
  it('should return properly-namespaced initial state', () => {
    const initialState = {
      auth, config, k8s, namespace, rolebinding,
    };
    expect(rootReducer(undefined, {})).toEqual(initialState);
  });
});
