import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RolebindingListItem } from './RolebindingListItem';


Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('RolebindingListItem', () => {
    let props;

    beforeEach(() => {
      props = {
        dispatchRolebindingDelete: jest.fn(),
        rolebindingName: 'some-rolebinding',
        selectedNamespace: 'some-namespace',
      };
    });

    it('should render itself and its subcomponents', () => {
      const rolebindingListItem = shallow(<RolebindingListItem {...props} />);
      expect(rolebindingListItem).toMatchSnapshot();
    });

    it('should dispatch an action to delete a rolebinding on delete button click', () => {
      const mockFn = jest.fn();
      const event = {
        preventDefault: jest.fn(),
      };

      props.dispatchRolebindingDelete = mockFn;
      const rolebindingListItem = shallow(<RolebindingListItem {...props} />);

      rolebindingListItem.find('button').simulate('click', event);
      expect(mockFn).toHaveBeenCalledWith('some-namespace', 'some-rolebinding');
    });
  });
});
