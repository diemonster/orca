import namespaceReducer, { initialState } from './namespaceReducer';
import * as types from '../actions/actionTypes';


describe('namespace reducer', () => {
  it('should return the initial state', () => {
    expect(namespaceReducer(undefined, {})).toEqual(initialState);
  });

  it('should replace namespaceCreateInput on NAMESPACE_CREATE_CHANGE_INPUT', () => {
    const state = {
      ...initialState,
      namespaceCreateInput: 'ab',
    };

    const action = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(initialState);
  });

  it('should replace namespaceObjects on NAMESPACE_LIST_SUCCESS', () => {
    const state = {
      ...initialState,
      namespaceObjects: [
        { name: 'namespace1', status: 'ACTIVE' },
        { name: 'namespace2', status: 'ACTIVE' },
      ],
    };

    const action = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
    };

    const expectedState = {
      ...initialState,
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });

  it('should replace selectedNamespace on NAMESPACE_SELECT', () => {
    const state = {
      ...initialState,
      selectedNamespace: 'some-namespace',
    };

    const action = {
      type: types.NAMESPACE_SELECT,
      namespace: '',
    };

    expect(namespaceReducer(state, action)).toEqual(initialState);
  });
});
