import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NavigationBar } from './NavigationBar';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  let props;

  beforeEach(() => {
    props = {
      dispatchLogin: jest.fn(),
      dispatchLogout: jest.fn(),
      isAuthenticated: false,
      username: '',
    };
  });

  describe('NavigationBar', () => {
    it('should render the login view when not authenticated', () => {
      const navigationBar = shallow(<NavigationBar {...props} />);
      expect(navigationBar).toMatchSnapshot();
    });

    it('should render the logout view when authenticated', () => {
      props.isAuthenticated = true;
      props.username = 'username';

      const navigationBar = shallow(<NavigationBar {...props} />);
      expect(navigationBar).toMatchSnapshot();
    });

    describe('methods', () => {
      it('handleLogin should dispatch a login action', () => {
        const navigationBar = shallow(<NavigationBar {...props} />);
        navigationBar.find('button').simulate('click');
        expect(props.dispatchLogin).toHaveBeenCalledWith();
      });

      it('handleLogout should dispatch a logout action', () => {
        props.isAuthenticated = true;
        props.username = 'username';

        const navigationBar = shallow(<NavigationBar {...props} />);
        navigationBar.find('button').simulate('click');
        expect(props.dispatchLogout).toHaveBeenCalledWith();
      });
    });
  });
});
