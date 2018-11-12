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

      expect(namespaceCreate.find('div').hasClass('create-namespace')).toBe(true);
      expect(namespaceCreate.find('h2').text()).toEqual('Create Namespace');
      expect(namespaceCreate.find('form').hasClass('namespace-input-form')).toBe(true);
      expect(namespaceCreate.find('form').prop('id')).toEqual('namespace-create-input-form');
      expect(namespaceCreate.find('label').hasClass('namespace-input-label')).toBe(true);
      expect(namespaceCreate.find('label').text()).toEqual('New Namespace:');
      expect(namespaceCreate.find('input').prop('type')).toEqual('text');
      expect(namespaceCreate.find('input').prop('value')).toEqual('');
      expect(namespaceCreate.find('input').prop('placeholder')).toEqual('enter namespace');
      expect(namespaceCreate.find('input').prop('name')).toEqual('namespace-create-input');
      expect(namespaceCreate.find('input').prop('id')).toEqual('namespace-create-input');
      expect(namespaceCreate.find('button').hasClass('button')).toBe(true);
      expect(namespaceCreate.find('button').prop('type')).toEqual('submit');
      expect(namespaceCreate.find('button').prop('value')).toEqual('submit');
      expect(namespaceCreate.find('button').text()).toEqual('Create');
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
