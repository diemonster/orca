import auth0 from 'auth0-js';
import Authenticator from './authenticator';

describe('Authenticator', () => {
  it('initializes', () => {
    const domain = 'domain';
    const clientID = '1234567890';

    const webAuth = jest.spyOn(auth0, 'WebAuth');

    const authenticator = new Authenticator(domain, clientID);

    // There are some default values supplied in `new auth0.WebAuth()` that we
    // don't set, and so we don't care about checking those. To that end, we
    // can do some fancy footwork to only check the values we expect to supply.
    //
    // Reference:
    // https://medium.com/@boriscoder/the-hidden-power-of-jest-matchers-f3d86d8101b0
    expect(webAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        domain,
        clientID,
        redirectUri: `${window.location.origin}/callback`,
        responseType: 'token id_token',
        scope: 'openid profile',
      }),
    );

    expect(authenticator.accessToken).toEqual('');
  });

  describe('login() method', () => {
    it('calls auth0.authorize() with correct args', () => {
      const authenticator = new Authenticator('', '');

      const authorize = jest.fn();
      authenticator.auth0.authorize = authorize;

      authenticator.login();

      expect(authorize).toHaveBeenCalledWith();
    });
  });

  describe('getProfile() method', () => {
    it('calls auth0.client.userInfo() with correct args', () => {
      const token = 'TOKEN';
      const getItem = jest.fn(() => token);
      global.localStorage = { getItem };

      const authenticator = new Authenticator('', '');

      const userInfo = jest.fn();
      authenticator.auth0.client.userInfo = userInfo;

      const cb = jest.fn();
      authenticator.getProfile(cb);

      expect(getItem).toHaveBeenCalledWith('access_token');
      expect(userInfo).toHaveBeenCalledWith(token, cb);
    });

    it('returns undefined if access token is null', () => {
      const getItem = jest.fn(() => null);
      global.localStorage = { getItem };

      const authenticator = new Authenticator('', '');

      const cb = jest.fn();
      expect(authenticator.getProfile(cb)).toBeUndefined();
      expect(getItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('handleAuthentication() method', () => {
    it('sets session on authentication success', () => {
      const authenticator = new Authenticator('', '');

      const authResult = { accessToken: 'TOKEN' };
      const parseHash = jest.fn((options, cb) => { cb(null, authResult); });
      authenticator.auth0.parseHash = parseHash;
      const setSession = jest.fn();
      authenticator.setSession = setSession;

      authenticator.handleAuthentication();

      expect(parseHash).toHaveBeenCalledWith({}, expect.any(Function));
      expect(setSession).toHaveBeenCalledWith(authResult);
    });

    it('does not set session on authentication error', () => {
      const authenticator = new Authenticator('', '');

      const parseHash = jest.fn((options, cb) => { cb(new Error(), null); });
      authenticator.auth0.parseHash = parseHash;
      const setSession = jest.fn();
      authenticator.setSession = setSession;

      authenticator.handleAuthentication();

      expect(parseHash).toHaveBeenCalledWith({}, expect.any(Function));
      expect(setSession).not.toHaveBeenCalled();
    });
  });

  describe('setSession() method', () => {
    it('properly writes access token and expiration to local storage and authenticator', () => {
      const setItem = jest.fn();
      global.localStorage = { setItem };

      const accessToken = 'TOKEN';
      const expiresIn = 5;
      const authResult = { accessToken, expiresIn };

      const authenticator = new Authenticator('', '');

      authenticator.setSession(authResult);

      expect(setItem.mock.calls).toEqual([
        ['access_token', accessToken],
        ['expires_at', expect.any(String)],
      ]);

      expect(authenticator.accessToken).toEqual(accessToken);
    });
  });

  describe('logout() method', () => {
    it('properly clears local storage and authenticator of auth data', () => {
      const removeItem = jest.fn();
      global.localStorage = { removeItem };

      const authenticator = new Authenticator('', '');
      authenticator.accessToken = 'TOKEN';

      authenticator.logout();

      expect(removeItem.mock.calls).toEqual([
        ['access_token'],
        ['expires_at'],
        ['name'],
      ]);

      expect(authenticator.accessToken).toEqual('');
    });
  });

  describe('isAuthenticated() method', () => {
    it('returns true if token has not expired', () => {
      const expiresAt = JSON.stringify(new Date().getTime() + 500);
      const getItem = jest.fn(() => expiresAt);
      global.localStorage = { getItem };

      const authenticator = new Authenticator('', '');

      expect(authenticator.isAuthenticated()).toBe(true);
    });

    it('returns false if token has expired', () => {
      const expiresAt = JSON.stringify(new Date().getTime() - 1);
      const getItem = jest.fn(() => expiresAt);
      global.localStorage = { getItem };

      const authenticator = new Authenticator('', '');

      expect(authenticator.isAuthenticated()).toBe(false);
    });
  });
});
