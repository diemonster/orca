import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NamespaceList } from './NamespaceList';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NamespaceList', () => {
    it('should render itself and its subcomponents when namespaceObjects === 0', () => {
      const props = {
        dispatchNamespaceList: jest.fn(),
        namespaceObjects: [],
      };

      const namespaceList = shallow(<NamespaceList {...props} />);

      expect(namespaceList).toMatchSnapshot();
      expect(namespaceList.find('div').hasClass('namespace-list-container')).toBe(true);
      expect(namespaceList.find('h2').text()).toEqual('List Namespaces');
      expect(namespaceList.find('p').text()).toEqual('Loading namespaces...');
    });

    it('should render itself and subcomponents when namespaceObjects.length > 0', () => {
      const props = {
        dispatchNamespaceList: jest.fn(),
        namespaceObjects: [
          { name: 'namespace1', status: 'Active' },
          { name: 'namespace2', status: 'Terminating' },
        ],
      };

      const namespaceList = shallow(<NamespaceList {...props} />);

      expect(namespaceList.find('div').hasClass('namespace-list-container')).toBe(true);
      expect(namespaceList.find('h2').text()).toEqual('List Namespaces');
      expect(namespaceList.find('ul').hasClass('namespace-list')).toBe(true);

      const listItems = namespaceList.find('ul').children();
      expect(listItems.length).toEqual(2);
      expect(listItems.at(0).props().namespace).toEqual('namespace1');
      expect(listItems.at(0).props().phase).toEqual('Active');
      expect(listItems.at(1).props().namespace).toEqual('namespace2');
      expect(listItems.at(1).props().phase).toEqual('Terminating');
    });
  });
});
