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
    });

    it('should render the logout view if a logout function is passed', () => {
      const props = {
        logout: jest.fn(),
      };

      const navigationBar = shallow(<NavigationBar {...props} />);

      expect(navigationBar).toMatchSnapshot();
    });

    it('should render the logout view with a username if a logout function and username are passed', () => {
      const props = {
        logout: jest.fn(),
        name: 'username',
      };

      const navigationBar = shallow(<NavigationBar {...props} />);

      expect(navigationBar).toMatchSnapshot();
    });
  });
});
