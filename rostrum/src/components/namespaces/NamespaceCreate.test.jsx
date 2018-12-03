import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NamespaceCreate } from './NamespaceCreate';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NamespaceCreate', () => {
    it('should render itself and its subcomponents', () => {
      const props = {
        dispatchNamespaceCreate: jest.fn(),
        dispatchNamespaceCreateChangeInput: jest.fn(),
        namespaceCreateInput: '',
      };

      const namespaceCreate = shallow(<NamespaceCreate {...props} />);

      expect(namespaceCreate).toMatchSnapshot();
    });

    it('appropriately calls dispatchNamespaceCreateChangeInput() on input change', () => {
      const mockFn = jest.fn();
      const props = {
        dispatchNamespaceCreate: jest.fn(),
        dispatchNamespaceCreateChangeInput: mockFn,
        namespaceCreateInput: '',
      };

      const namespaceCreate = shallow(<NamespaceCreate {...props} />);

      const event = { preventDefault: jest.fn(), target: { value: 'a' } };
      namespaceCreate.find('input').simulate('change', event);
      expect(mockFn).toBeCalledWith('a');
    });

    it('appropriately calls dispatchNamespaceCreate() on form submit', () => {
      const mockFn = jest.fn();
      const props = {
        dispatchNamespaceCreate: mockFn,
        dispatchNamespaceCreateChangeInput: jest.fn(),
        namespaceCreateInput: 'new-namespace',
      };

      const namespaceCreate = shallow(<NamespaceCreate {...props} />);

      const event = { preventDefault: jest.fn(), target: { value: 'new-namespace' } };
      namespaceCreate.find('form').simulate('submit', event);
      expect(mockFn).toBeCalledWith('new-namespace');
    });
  });
});
