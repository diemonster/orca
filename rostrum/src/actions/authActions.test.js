import * as actions from './authActions';
import * as types from './actionTypes';


describe('actions', () => {
  describe('authError', () => {
    it('should return an action to emit an error', () => {
      const error = Error();
      const expectedAction = { type: types.AUTH_ERROR, error };
      expect(actions.authError(error)).toEqual(expectedAction);
    });
  });

  describe('checkAuthentication', () => {
    it('should return an action to check a user\'s authentication', () => {
      const expectedAction = { type: types.AUTH_CHECK_AUTHENTICATION };
      expect(actions.checkAuthentication()).toEqual(expectedAction);
    });
  });

  describe('clearLocalStorage', () => {
    it('should return an action to clear the browser\'s local storage', () => {
      const expectedAction = { type: types.AUTH_CLEAR_LOCAL_STORAGE };
      expect(actions.clearLocalStorage()).toEqual(expectedAction);
    });
  });

  describe('handleAuthentication', () => {
    it('should return an action to handle an authentication result from a URL hash', () => {
      const urlHash = 'some hash';
      const expectedAction = { type: types.AUTH_HANDLE_AUTHENTICATION, urlHash };
      expect(actions.handleAuthentication(urlHash)).toEqual(expectedAction);
    });
  });

  describe('login', () => {
    it('should return an action to log the user in', () => {
      const expectedAction = { type: types.AUTH_LOGIN };
      expect(actions.login()).toEqual(expectedAction);
    });
  });

  describe('logout', () => {
    it('should return an action to log the user out', () => {
      const expectedAction = { type: types.AUTH_LOGOUT };
      expect(actions.logout()).toEqual(expectedAction);
    });
  });

  describe('setAuthenticated', () => {
    it('should return an action to write a user\'s authentication status to state', () => {
      const authenticated = true;
      const expectedAction = { type: types.AUTH_SET_AUTHENTICATED, authenticated };
      expect(actions.setAuthenticated(authenticated)).toEqual(expectedAction);
    });
  });

  describe('setUsername', () => {
    it('should return an action to write a user\'s username to state', () => {
      const username = 'some username';
      const expectedAction = { type: types.AUTH_SET_USERNAME, username };
      expect(actions.setUsername(username)).toEqual(expectedAction);
    });
  });
});
