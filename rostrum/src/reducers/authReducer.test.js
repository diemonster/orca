import authReducer, { initialState } from './authReducer';
import * as types from '../actions/actionTypes';


describe('authReducer', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it('should replace isAuthenticated on AUTH_SET_AUTHENTICATED', () => {
    const state = { ...initialState, isAuthenticated: true };
    const action = {
      type: types.AUTH_SET_AUTHENTICATED,
      authenticated: false,
    };

    expect(authReducer(state, action)).toEqual(initialState);
  });

  it('should replace username on AUTH_SET_USERNAME', () => {
    const state = { ...initialState, username: 'some username' };
    const action = {
      type: types.AUTH_SET_USERNAME,
      username: '',
    };

    expect(authReducer(state, action)).toEqual(initialState);
  });
});
