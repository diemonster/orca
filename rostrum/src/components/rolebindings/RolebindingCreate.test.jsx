import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RolebindingCreate } from './RolebindingCreate';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('RolebindingCreate', () => {
    let props;

    beforeEach(() => {
      props = {
        dispatchRolebindingCreate: jest.fn(),
        dispatchRolebindingCreateChangeInput: jest.fn(),
        rolebindingCreateRoleInput: '',
        rolebindingCreateSubjectInput: '',
        roleOptions: [],
        selectedNamespace: '',
      };
    });

    it('should render itself and its subcomponents', () => {
      const rolebindingCreate = shallow(<RolebindingCreate {...props} />);
      expect(rolebindingCreate).toMatchSnapshot();
    });

    it('dispatches an action to change input when a user enters text', () => {
      const mockFn = jest.fn();
      props.dispatchRolebindingCreateChangeInput = mockFn;

      const rolebindingCreate = shallow(<RolebindingCreate {...props} />);

      const event = {
        preventDefault: jest.fn(),
        target: { value: 'a', name: 'name' },
      };

      rolebindingCreate.find('input').simulate('change', event);
      expect(mockFn).toBeCalledWith('name', 'a');
    });

    it('dispatches an action to create a rolebinding on form submit', () => {
      const mockFn = jest.fn();
      props.dispatchRolebindingCreate = mockFn;
      props.rolebindingCreateRoleInput = 'some-role';
      props.rolebindingCreateSubjectInput = 'some-subject';
      props.selectedNamespace = 'some-namespace';

      const rolebindingCreate = shallow(<RolebindingCreate {...props} />);

      const event = { preventDefault: jest.fn() };

      rolebindingCreate.find('form').simulate('submit', event);
      expect(mockFn).toBeCalledWith('some-namespace', 'some-role', 'some-subject');
    });
  });
});
