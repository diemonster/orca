import rootReducer from './rootReducer';

describe('root reducer', () => {
  it('should return properly-namespaced initial state', () => {
    const initialState = {
      config: {},
      namespace: {
        namespaceCreateInput: '',
        namespaceDeleteInput: '',
        namespaceObjects: [],
      },
      rolebinding: {
        namespacedRolebindings: {},
      },
    };

    expect(rootReducer(undefined, {})).toEqual(initialState);
  });
});
