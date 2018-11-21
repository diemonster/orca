import rolebindingReducer, { initialState } from './rolebindings';
import * as types from '../actions/actionTypes';

describe('rolebinding reducer', () => {
  it('should return the initial state', () => {
    expect(rolebindingReducer(undefined, {})).toEqual(initialState);
  });

  it('should replace rolebindings on ROLEBINDING_LIST_SUCCESS', () => {
    const state = { rolebindings: ['rolebinding1', 'rolebinding2'] };

    const action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace1',
      rolebindings: ['rolebinding2'],
    };

    const expectedState = { rolebindings: ['rolebinding2'] };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });
});
