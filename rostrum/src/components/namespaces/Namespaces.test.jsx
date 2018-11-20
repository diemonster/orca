import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Namespaces from './Namespaces';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Namespaces', () => {
    it('should render itself and subcomponents', () => {
      const namespaces = shallow(<Namespaces />);
      expect(namespaces).toMatchSnapshot();
    });
  });
});
