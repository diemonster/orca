import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import Root from './Root';
import Authenticator from '../authenticator/authenticator';
import History from '../authenticator/history';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Root', () => {
    beforeEach(() => {
      window.config = {
        auth0Domain: 'test.com',
        auth0ClientID: '1234567890',
      };
    });

    it('should render itself and its subcomponents', () => {
      const expectedState = {
        config: {
          auth0Domain: 'test.com',
          auth0ClientID: '1234567890',
        },
        namespace: {
          namespaceCreateInput: '',
          namespaceDeleteInput: '',
          namespaceObjects: [],
        },
        rolebinding: {
          namespacedRolebindings: {},
        },
      };

      const root = shallow(<Root />);

      expect(root).toMatchSnapshot();
      expect(root.find(Provider).prop('store').getState()).toEqual(expectedState);
      expect(root.find(Router).prop('history')).toEqual(History);
      expect(root.find(Switch).children().length).toEqual(2);
      expect(root.find(Switch).childAt(0).prop('path')).toEqual('/callback');
    });

    it('should set properties on componentWillMount', () => {
      const expectedState = {
        config: {
          auth0Domain: 'test.com',
          auth0ClientID: '1234567890',
        },
        namespace: {
          namespaceCreateInput: '',
          namespaceDeleteInput: '',
          namespaceObjects: [],
        },
        rolebinding: {
          namespacedRolebindings: {},
        },
      };

      const instance = shallow(<Root />).instance();

      const authenticator = new Authenticator(
        window.config.auth0Domain,
        window.config.auth0ClientID,
      );

      authenticator.getProfile = (cb) => {
        this.auth0.client.userInfo('', cb);
      };

      expect(instance.config).toEqual(window.config);
      expect(instance.store.getState()).toEqual(expectedState);
      // I don't know if there's a better way to check for equality of two
      // discrete but identical instances. Using JSON.stringify() here returns an
      // error about converting a circular structure, and
      // expect(instance.authenticator).toEqual(authenticator) returns false
      // even though jest states that there is no visible diff.
      expect(`${instance.authenticator}`).toEqual(`${authenticator}`);
    });

    // it('should generate the right <Auth> component', () => {
    // const instance = shallow(<Root />).instance();
    // instance.authenticator.getProfile = jest.fn();
    // const auth = shallow(instance.authWithProps());
    //
    // expect(auth.prop('authenticator')).toBe(instance.authenticator);
    // });
  });
});
