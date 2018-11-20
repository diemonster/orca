import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Sidebar from './Sidebar';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Sidebar', () => {
    it('renders itself', () => {
      const sidebar = shallow(<Sidebar />);
      expect(sidebar).toMatchSnapshot();
    });
  });
});
