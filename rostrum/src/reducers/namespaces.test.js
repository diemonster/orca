import namespaceReducer, { initialState } from './namespaces';
import * as types from '../actions/actionTypes';

describe('namespace reducer', () => {
  it('should return the initial state', () => {
    expect(namespaceReducer(undefined, {})).toEqual(initialState);
  });

  it('should replace namespaceCreateInput on NAMESPACE_CREATE_CHANGE_INPUT', () => {
    const state = {
      namespaceCreateInput: 'ab',
      namespaceObjects: [],
      selectedNamespace: '',
    };

    const action = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(initialState);
  });

  it('should replace namespaceObjects on NAMESPACE_LIST_SUCCESS', () => {
    const state = {
      namespaceCreateInput: '',
      namespaceObjects: [
        { name: 'namespace1', status: 'ACTIVE' },
        { name: 'namespace2', status: 'ACTIVE' },
      ],
      selectedNamespace: '',
    };

    const action = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
    };

    const expectedState = {
      namespaceCreateInput: '',
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
      selectedNamespace: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });
});
