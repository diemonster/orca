import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NamespaceListItem from './NamespaceListItem';
import RolebindingList from '../rolebindings/RolebindingList';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NamespaceListItem', () => {
    it('should render itself and its subcomponents', () => {
      const props = {
        namespace: 'some-namespace',
        phase: 'Active',
      };

      const namespaceListItem = shallow(<NamespaceListItem {...props} />);

      expect(namespaceListItem).toMatchSnapshot();
      expect(namespaceListItem.find('li').hasClass('namespace-list-item')).toBe(true);
      expect(namespaceListItem.find('li').hasClass('phase-active')).toBe(true);
      expect(namespaceListItem.find('h4').text()).toEqual('some-namespace');

      const rolebindingListProps = namespaceListItem.find(RolebindingList).props();
      expect(rolebindingListProps.namespace).toEqual('some-namespace');
    });

    it('should set "phase-terminating" class if passed "Terminating"', () => {
      const props = {
        namespace: 'some-namespace',
        phase: 'Terminating',
      };

      const namespaceListItem = shallow(<NamespaceListItem {...props} />);

      expect(namespaceListItem.find('li').hasClass('phase-terminating')).toBe(true);
    });
  });
});
