import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import { NamespaceDelete } from './NamespaceDelete';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NamespaceDelete', () => {
    it('should render itself and its subcomponents', () => {
      const props = {
        dispatchNamespaceDelete: jest.fn(),
        dispatchNamespaceDeleteChangeInput: jest.fn(),
        namespaceDeleteInput: '',
      };

      const namespaceDelete = shallow(<NamespaceDelete {...props} />);

      expect(namespaceDelete).toMatchSnapshot();
      expect(namespaceDelete.find('div').hasClass('delete-namespace')).toBe(true);
      expect(namespaceDelete.find('h2').text()).toEqual('Delete Namespace');
      expect(namespaceDelete.find('form').hasClass('namespace-input-form')).toBe(true);
      expect(namespaceDelete.find('form').prop('id')).toEqual('namespace-delete-input-form');
      expect(namespaceDelete.find('label').hasClass('namespace-input-label')).toBe(true);
      expect(namespaceDelete.find('label').text()).toEqual('Delete Namespace:');
      expect(namespaceDelete.find('input').prop('type')).toEqual('text');
      expect(namespaceDelete.find('input').prop('value')).toEqual('');
      expect(namespaceDelete.find('input').prop('placeholder')).toEqual('enter namespace');
      expect(namespaceDelete.find('input').prop('name')).toEqual('namespace-delete-input');
      expect(namespaceDelete.find('input').prop('id')).toEqual('namespace-delete-input');
      expect(namespaceDelete.find('button').hasClass('button')).toBe(true);
      expect(namespaceDelete.find('button').prop('type')).toEqual('submit');
      expect(namespaceDelete.find('button').prop('value')).toEqual('submit');
      expect(namespaceDelete.find('button').text()).toEqual('Delete');
    });

    it('appropriately calls dispatchNamespaceDeleteChangeInput() on input change', () => {
      const mockFn = jest.fn();
      const props = {
        dispatchNamespaceDelete: jest.fn(),
        dispatchNamespaceDeleteChangeInput: mockFn,
        namespaceDeleteInput: '',
      };

      const namespaceDelete = shallow(<NamespaceDelete {...props} />);

      const event = { preventDefault: jest.fn(), target: { value: 'a' } };
      namespaceDelete.find('input').simulate('change', event);
      expect(mockFn).toBeCalledWith('a');
    });

    it('appropriately calls dispatchNamespaceDelete() on form submit', () => {
      const mockFn = jest.fn();
      const props = {
        dispatchNamespaceDelete: mockFn,
        dispatchNamespaceDeleteChangeInput: jest.fn(),
        namespaceDeleteInput: 'some-namespace',
      };

      const namespaceDelete = shallow(<NamespaceDelete {...props} />);

      const event = { preventDefault: jest.fn(), target: { value: 'some-namespace' } };
      namespaceDelete.find('form').simulate('submit', event);
      expect(mockFn).toBeCalledWith('some-namespace');
    });
  });
});
