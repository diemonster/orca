import namespaceReducer from './namespaces';
import * as types from '../actions/actionTypes';

describe('namespace reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      selectedNamespace: '',
    };

    expect(namespaceReducer(undefined, {})).toEqual(initialState);
  });

  it('should replace namespaceCreateInput on NAMESPACE_CREATE_CHANGE_INPUT', () => {
    const state = {
      namespaceObjects: [],
      namespaceCreateInput: 'ab',
      namespaceDeleteInput: '',
    };

    const action = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput: '',
    };

    const expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });

  it('should replace namespaceObjects on NAMESPACE_LIST_SUCCESS', () => {
    const state = {
      namespaceObjects: [
        { name: 'namespace1', status: 'ACTIVE' },
        { name: 'namespace2', status: 'ACTIVE' },
      ],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    const action = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
    };

    const expectedState = {
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });
});
