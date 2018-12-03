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
    });
  });
});
