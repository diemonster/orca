import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { App } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  let props;

  beforeEach(() => {
    props = {
      dispatchHandleAuthentication: jest.fn(),
      isAuthenticated: false,
      location: { hash: '' },
    };
  });

  describe('App', () => {
    it('should not render namespaces nor rolebindings when not authenticated', () => {
      const app = shallow(<App {...props} />);
      expect(app).toMatchSnapshot();
    });

    it('should render namespaces and rolebindings when authenticated', () => {
      props.isAuthenticated = true;

      const app = shallow(<App {...props} />);
      expect(app).toMatchSnapshot();
    });

    describe('methods', () => {
      it('handleAuthentication should dispatch an action when the url contains an auth hash', () => {
        props.location = { hash: 'access_token' };
        shallow(<App {...props} />);
        expect(props.dispatchHandleAuthentication).toHaveBeenCalledWith(props.location.hash);
      });

      it('handleAuthentication should not dispatch an action when the url does not contain an auth hash', () => {
        shallow(<App {...props} />);
        expect(props.dispatchHandleAuthentication).not.toHaveBeenCalled();
      });
    });
  });
});
