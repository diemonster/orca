import rootReducer from './rootReducer';

describe('root reducer', () => {
  it('should return properly-namespaced initial state', () => {
    const initialState = {
      config: {},
      namespace: {
        namespaceCreateInput: '',
        namespaceObjects: [],
        selectedNamespace: '',
      },
      rolebinding: {
        rolebindings: [],
      },
    };

    expect(rootReducer(undefined, {})).toEqual(initialState);
  });
});
