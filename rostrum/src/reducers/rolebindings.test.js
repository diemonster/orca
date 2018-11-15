import rolebindingReducer from './rolebindings';
import * as types from '../actions/actionTypes';

describe('rolebinding reducer', () => {
  it('should return the initial state', () => {
    const initialState = { namespacedRolebindings: {} };
    expect(rolebindingReducer(undefined, {})).toEqual(initialState);
  });

  it('should replace value of existing namespace key on ROLEBINDING_LIST_SUCCESS', () => {
    const state = { namespacedRolebindings: { namespace1: ['rolebinding1', 'rolebinding2'] } };

    const action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace1',
      rolebindings: ['rolebinding2'],
    };

    const expectedState = { namespacedRolebindings: { namespace1: ['rolebinding2'] } };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });

  it('should add new namespace key to existing state on ROLEBINDING_LIST_SUCCESS', () => {
    const state = {
      namespacedRolebindings: {
        namespace1: ['rolebinding1'],
      },
    };

    const action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace2',
      rolebindings: ['rolebinding1'],
    };

    const expectedState = {
      namespacedRolebindings: {
        namespace1: ['rolebinding1'],
        namespace2: ['rolebinding1'],
      },
    };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });
});
