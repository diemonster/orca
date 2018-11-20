import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RolebindingList } from './RolebindingList';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('RolebindingList', () => {
    it('should render itself and its subcomponents when namespacedRolebindings === 0', () => {
      const props = {
        dispatchRolebindingList: jest.fn(),
        namespace: 'some-namespace',
        namespacedRolebindings: {},
      };

      const rolebindingList = shallow(<RolebindingList {...props} />);

      expect(rolebindingList).toMatchSnapshot();
      expect(rolebindingList.find('div').hasClass('rolebinding-container')).toBe(true);
      expect(rolebindingList.find('h5').text()).toEqual('Role Bindings:');
      expect(rolebindingList.find('ul').hasClass('rolebinding-list')).toBe(true);
      expect(rolebindingList.find('ul').children().length).toEqual(0);
    });

    it('should render itself and subcomponents when namespacedRolebindings.length > 0 and no namespaces match', () => {
      const props = {
        dispatchRolebindingList: jest.fn(),
        namespace: 'some-namespace',
        namespacedRolebindings: {
          'some-other-namespace': ['some-rolebinding'],
        },
      };

      const rolebindingList = shallow(<RolebindingList {...props} />);

      expect(rolebindingList).toMatchSnapshot();
      expect(rolebindingList.find('div').hasClass('rolebinding-container')).toBe(true);
      expect(rolebindingList.find('h5').text()).toEqual('Role Bindings:');
      expect(rolebindingList.find('ul').hasClass('rolebinding-list')).toBe(true);
      expect(rolebindingList.find('ul').children().length).toEqual(0);
    });

    it('should render itself and subcomponents when namespacedRolebindings.length > 0 and a namespace matches', () => {
      const props = {
        dispatchRolebindingList: jest.fn(),
        namespace: 'some-namespace',
        namespacedRolebindings: {
          'some-namespace': ['some-rolebinding', 'some-other-rolebinding'],
        },
      };

      const rolebindingList = shallow(<RolebindingList {...props} />);

      expect(rolebindingList).toMatchSnapshot();
      expect(rolebindingList.find('div').hasClass('rolebinding-container')).toBe(true);
      expect(rolebindingList.find('h5').text()).toEqual('Role Bindings:');
      const ul = rolebindingList.find('ul');
      expect(ul.hasClass('rolebinding-list')).toBe(true);
      expect(ul.children().length).toEqual(2);
      expect(ul.childAt(0).prop('rolebindingName')).toEqual('some-rolebinding');
      expect(ul.childAt(1).prop('rolebindingName')).toEqual('some-other-rolebinding');
    });
  });
});
