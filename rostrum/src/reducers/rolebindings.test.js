import rolebindingReducer from './rolebindings';
import * as types from '../actions/actionTypes';

describe('rolebinding reducer', () => {
  it('should return the initial state', () => {
    const initialState = { namespacedRolebindings: {} };
    expect(rolebindingReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle ROLEBINDING_LIST_SUCCESS', () => {
    let state;
    let action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace1',
      rolebindings: ['rolebinding1'],
    };

    let expectedState = {
      namespacedRolebindings: { namespace1: ['rolebinding1'] },
    };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace1',
      rolebindings: ['rolebinding1', 'rolebinding2'],
    };

    expectedState = {
      namespacedRolebindings: { namespace1: ['rolebinding1', 'rolebinding2'] },
    };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace2',
      rolebindings: ['rolebinding1', 'rolebinding2'],
    };

    expectedState = {
      namespacedRolebindings: {
        namespace1: ['rolebinding1', 'rolebinding2'],
        namespace2: ['rolebinding1', 'rolebinding2'],
      },
    };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);

    state = expectedState;
    action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace1',
      rolebindings: ['rolebinding2'],
    };

    expectedState = {
      namespacedRolebindings: {
        namespace1: ['rolebinding2'],
        namespace2: ['rolebinding1', 'rolebinding2'],
      },
    };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });
});
