import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NamespaceList } from './NamespaceList';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('NamespaceList', () => {
    it('should render itself and its subcomponents when namespaceObjects === 0', () => {
      const props = {
        dispatchNamespaceList: jest.fn(),
        namespaceObjects: [],
      };

      const namespaceList = shallow(<NamespaceList {...props} />);

      expect(namespaceList).toMatchSnapshot();
    });

    it('should render itself and subcomponents when namespaceObjects.length > 0', () => {
      const props = {
        dispatchNamespaceList: jest.fn(),
        namespaceObjects: [
          { name: 'namespace1', status: 'Active' },
          { name: 'namespace2', status: 'Terminating' },
        ],
      };

      const namespaceList = shallow(<NamespaceList {...props} />);

      expect(namespaceList).toMatchSnapshot();
    });
  });
});
