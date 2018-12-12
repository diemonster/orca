import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Rolebindings } from './Rolebindings';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Rolebindings', () => {
    it('should render itself when no namespace is selected', () => {
      const props = {
        selectedNamespace: '',
      };

      const rolebindings = shallow(<Rolebindings {...props} />);
      expect(rolebindings).toMatchSnapshot();
    });

    it('should render itself and subcomponents when a namespace is selected', () => {
      const props = {
        selectedNamespace: 'some-namespace',
      };

      const rolebindings = shallow(<Rolebindings {...props} />);
      expect(rolebindings).toMatchSnapshot();
    });
  });
});
