import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationBar from './NavigationBar';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NavigationBar', () => {
    it('should render the login view if a logout function is not passed', () => {
      const props = {
        login: jest.fn(),
        name: 'username',
      };

      const navigationBar = shallow(<NavigationBar {...props} />);

      expect(navigationBar).toMatchSnapshot();
      expect(navigationBar.find('div').hasClass('navigation-bar')).toBe(true);
      expect(navigationBar.find('ul').children().length).toEqual(1);
      expect(navigationBar.find('ul').childAt(0).hasClass('profile')).toBe(true);
      expect(navigationBar.find('button').prop('onClick')).toEqual(props.login);
      expect(navigationBar.find('button').text()).toEqual('Log In');
    });

    it('should render the logout view if a logout function is passed', () => {
      const props = {
        logout: jest.fn(),
      };

      const navigationBar = shallow(<NavigationBar {...props} />);

      expect(navigationBar).toMatchSnapshot();
      expect(navigationBar.find('div').hasClass('navigation-bar')).toBe(true);
      expect(navigationBar.find('ul').children().length).toEqual(2);
      const ul = navigationBar.find('ul');
      expect(ul.childAt(0).hasClass('home')).toBe(true);
      expect(ul.childAt(0).text()).toEqual('Home');
      expect(ul.childAt(1).hasClass('profile')).toBe(true);
      expect(navigationBar.find('button').prop('onClick')).toEqual(props.logout);
      expect(navigationBar.find('button').text()).toEqual('Log Out');
    });

    it('should render the logout view with a username if a logout function and username are passed', () => {
      const props = {
        logout: jest.fn(),
        name: 'username',
      };

      const navigationBar = shallow(<NavigationBar {...props} />);

      expect(navigationBar).toMatchSnapshot();
      expect(navigationBar.find('button').prop('onClick')).toEqual(props.logout);
      expect(navigationBar.find('button').text()).toEqual(`${props.name}, Log Out`);
    });
  });
});
