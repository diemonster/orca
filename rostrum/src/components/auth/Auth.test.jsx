import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Auth from './Auth';
import Authenticator from '../../authenticator/authenticator';
import NavigationBar from '../navigationBar/NavigationBar';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Auth', () => {
    it('should render a login view when unauthenticated', () => {
      const authenticator = new Authenticator('', '');
      authenticator.login = jest.fn();
      authenticator.isAuthenticated = jest.fn(() => false);
      authenticator.getProfile = jest.fn((cb) => { cb(null, {}); });

      const props = { authenticator };

      const auth = shallow(<Auth {...props} />);

      expect(auth).toMatchSnapshot();
      expect(auth.find(NavigationBar).prop('login')).toBe(authenticator.login);
    });

    it('should render a logout view when authenticated', () => {
      const authenticator = new Authenticator('', '');
      authenticator.logout = jest.fn();
      authenticator.isAuthenticated = jest.fn(() => true);
      authenticator.getProfile = jest.fn((cb) => {
        cb(null, { name: 'username' });
      });

      const props = { authenticator };

      const auth = shallow(<Auth {...props} />);

      expect(auth).toMatchSnapshot();
      expect(auth.find(NavigationBar).prop('logout')).toBe(authenticator.logout);
    });
  });
});
