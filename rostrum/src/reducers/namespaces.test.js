import namespaceReducer from './namespaces';
import * as types from '../actions/actionTypes';

describe('namespace reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle NAMESPACE_CREATE_CHANGE_INPUT', () => {
    let state;
    let action = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput: 'a',
    };

    let expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: 'a',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput: 'ab',
    };

    expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: 'ab',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput: '',
    };

    expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });

  it('should handle NAMESPACE_DELETE_CHANGE_INPUT', () => {
    let state;
    let action = {
      type: types.NAMESPACE_DELETE_CHANGE_INPUT,
      namespaceDeleteInput: 'a',
    };

    let expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      namespaceDeleteInput: 'a',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.NAMESPACE_DELETE_CHANGE_INPUT,
      namespaceDeleteInput: 'ab',
    };

    expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      namespaceDeleteInput: 'ab',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.NAMESPACE_DELETE_CHANGE_INPUT,
      namespaceDeleteInput: '',
    };

    expectedState = {
      namespaceObjects: [],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });

  it('should handle NAMESPACE_LIST_SUCCESS', () => {
    let state;
    let action = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects: [{ name: 'namespace1', status: 'ACTIVE' }],
    };

    let expectedState = {
      namespaceObjects: [{ name: 'namespace1', status: 'ACTIVE' }],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects: [
        { name: 'namespace1', status: 'ACTIVE' },
        { name: 'namespace2', status: 'ACTIVE' },
      ],
    };

    expectedState = {
      namespaceObjects: [
        { name: 'namespace1', status: 'ACTIVE' },
        { name: 'namespace2', status: 'ACTIVE' },
      ],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };

    expect(namespaceReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
    };

    expectedState = {
      namespaceObjects: [{ name: 'namespace2', status: 'ACTIVE' }],
      namespaceCreateInput: '',
      namespaceDeleteInput: '',
    };
    expect(namespaceReducer(state, action)).toEqual(expectedState);
  });
});
