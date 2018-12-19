import rolebindingReducer, { initialState } from './rolebindingReducer';
import * as types from '../actions/actionTypes';


describe('rolebinding reducer', () => {
  it('should return the initial state', () => {
    expect(rolebindingReducer(undefined, {})).toEqual(initialState);
  });

  it('should conditionally replace roleInput on ROLEBINDING_CREATE_CHANGE_INPUT', () => {
    const state = { ...initialState, roleInput: 'some-role' };
    const action = {
      type: types.ROLEBINDING_CREATE_CHANGE_INPUT,
      inputType: 'role',
      inputValue: '',
    };

    const expectedState = { ...initialState, roleInput: '' };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });

  it('should conditionally replace subjectInput on ROLEBINDING_CREATE_CHANGE_INPUT', () => {
    const state = { ...initialState, subjectInput: 'some-subject' };
    const action = {
      type: types.ROLEBINDING_CREATE_CHANGE_INPUT,
      inputType: 'subject',
      inputValue: '',
    };

    const expectedState = { ...initialState, subjectInput: '' };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });

  it('should make no changes on unexpected ROLEBINDING_CREATE_CHANGE_INPUT', () => {
    const action = {
      type: types.ROLEBINDING_CREATE_CHANGE_INPUT,
      inputType: 'such unexpected',
      inputValue: 'many surprise',
    };

    expect(rolebindingReducer(undefined, action)).toEqual(initialState);
  });

  it('should replace rolebindings on ROLEBINDING_LIST_SUCCESS', () => {
    const state = { ...initialState, rolebindings: ['rolebinding1', 'rolebinding2'] };

    const action = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace: 'namespace1',
      rolebindings: ['rolebinding2'],
    };

    const expectedState = { ...initialState, rolebindings: ['rolebinding2'] };

    expect(rolebindingReducer(state, action)).toEqual(expectedState);
  });
});
