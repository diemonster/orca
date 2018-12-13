import * as types from '../actions/actionTypes';


export const initialState = {
  authClient: null,
  isAuthenticated: false,
  username: '',
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.authenticated,
      };

    case types.AUTH_SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };

    default:
      return state;
  }
}
