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
