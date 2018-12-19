import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import auth0 from 'auth0-js';
import K8sClient from '../middleware/k8sClient';

import Root from './Root';

import { initialState as auth } from '../reducers/authReducer';
import { initialState as config } from '../reducers/configReducer';
import { initialState as k8s } from '../reducers/k8sReducer';
import { initialState as namespace } from '../reducers/namespaceReducer';
import { initialState as rolebinding } from '../reducers/rolebindingReducer';


Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  const auth0Domain = 'test.com';
  const auth0ClientID = '1234567890';
  const proxyURL = 'proxy.url';
  const state = {
    auth, config, k8s, namespace, rolebinding,
  };

  beforeEach(() => {
    window.config = {
      auth0Domain, auth0ClientID, proxyURL,
    };
  });

  describe('Root', () => {
    it('should render itself and its subcomponents', () => {
      const root = shallow(<Root />);
      expect(root).toMatchSnapshot();
    });

    describe('on componentWillMount', () => {
      it('configures store with supplied clients', () => {
        const authClient = { someKey: 'some val' };
        const k8sClient = { someKey: 'some val' };
        window.config = { authClient, k8sClient };

        const expectedState = {
          ...state,
          auth: { ...state.auth, authClient },
          config: { ...state.config, authClient, k8sClient },
          k8s: { ...state.k8s, k8sClient },
        };

        const instance = shallow(<Root />).instance();
        expect(instance.store.getState()).toEqual(expectedState);
      });

      it('configures store with constructed clients', () => {
        const authClient = new auth0.WebAuth({
          domain: auth0Domain,
          clientID: auth0ClientID,
          redirectUri: window.location.origin,
          responseType: 'token id_token',
          scope: 'openid profile',
        });

        const k8sClient = new K8sClient(proxyURL);

        const expectedState = {
          ...state,
          auth: { ...state.auth, authClient },
          config: {
            auth0Domain, auth0ClientID, proxyURL, authClient: null, k8sClient: null,
          },
          k8s: { ...state.k8s, k8sClient },
        };

        const instance = shallow(<Root />).instance();
        expect(instance.store.getState()).toEqual(expectedState);
      });
    });
  });
});
