import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RolebindingList } from './RolebindingList';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('RolebindingList', () => {
    it('should render itself and its subcomponents when rolebindings.length === 0', () => {
      const props = {
        rolebindings: [],
        selectedNamespace: 'some-namespace',
      };

      const rolebindingList = shallow(<RolebindingList {...props} />);

      expect(rolebindingList).toMatchSnapshot();
    });

    it('should render itself and subcomponents when rolebindings.length > 0', () => {
      const props = {
        rolebindings: ['rolebinding1', 'rolebinding2'],
        selectedNamespace: 'some-namespace',
      };

      const rolebindingList = shallow(<RolebindingList {...props} />);

      expect(rolebindingList).toMatchSnapshot();
    });
  });
});
