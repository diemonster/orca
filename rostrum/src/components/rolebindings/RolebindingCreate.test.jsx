import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RolebindingCreate } from './RolebindingCreate';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('RolebindingCreate', () => {
    it('should render itself and its subcomponents', () => {
      const props = {
        dispatchRolebindingCreate: jest.fn(),
        dispatchRolebindingCreateChangeInput: jest.fn(),
        rolebindingCreateRoleInput: '',
        rolebindingCreateSubjectInput: '',
        roleOptions: [],
        selectedNamespace: '',
      };

      const rolebindingCreate = shallow(<RolebindingCreate {...props} />);
      expect(rolebindingCreate).toMatchSnapshot();
    });
  });
});
