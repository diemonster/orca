import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NamespaceListItem } from './NamespaceListItem';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NamespaceListItem', () => {
    it('should render itself with an active namespace', () => {
      const props = {
        dispatchNamespaceDelete: jest.fn(),
        dispatchNamespaceSelect: jest.fn(),
        namespace: 'some-namespace',
        phase: 'Active',
        selectedNamespace: '',
      };

      const namespaceListItem = shallow(<NamespaceListItem {...props} />);

      expect(namespaceListItem).toMatchSnapshot();
    });

    it('should render itself with a terminating namespace', () => {
      const props = {
        dispatchNamespaceDelete: jest.fn(),
        dispatchNamespaceSelect: jest.fn(),
        namespace: 'some-namespace',
        phase: 'Terminating',
        selectedNamespace: '',
      };

      const namespaceListItem = shallow(<NamespaceListItem {...props} />);

      expect(namespaceListItem).toMatchSnapshot();
    });
  });
});
