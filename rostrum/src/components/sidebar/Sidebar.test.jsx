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
      expect(sidebar.find('div').hasClass('sidebar')).toBe(true);
      const ul = sidebar.find('ul');
      expect(ul.children().length).toEqual(2);
      expect(ul.childAt(0).children().length).toEqual(1);
      expect(ul.childAt(0).childAt(0).prop('href')).toEqual('namespace');
      expect(ul.childAt(0).childAt(0).text()).toEqual('Namespaces');
      expect(ul.childAt(1).children().length).toEqual(1);
      expect(ul.childAt(1).childAt(0).prop('href')).toEqual('pod');
      expect(ul.childAt(1).childAt(0).text()).toEqual('Pods');
    });
  });
});
