import rootReducer from './rootReducer';
import { initialState as config } from './config';
import { initialState as namespace } from './namespaces';
import { initialState as rolebinding } from './rolebindings';

describe('root reducer', () => {
  it('should return properly-namespaced initial state', () => {
    const initialState = { config, namespace, rolebinding };
    expect(rootReducer(undefined, {})).toEqual(initialState);
  });
});
