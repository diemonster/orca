import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import RolebindingListItem from './RolebindingListItem';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('RolebindingListItem', () => {
    it('should render itself and its subcomponents', () => {
      const props = {
        rolebindingName: 'some-rolebinding',
      };

      const rolebindingListItem = shallow(<RolebindingListItem {...props} />);

      expect(rolebindingListItem).toMatchSnapshot();
    });
  });
});
