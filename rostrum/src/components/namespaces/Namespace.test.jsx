import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Namespace from './Namespace';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Namespace', () => {
    it('should render itself and its subcomponents', () => {
      const namespace = shallow(<Namespace />);
      expect(namespace).toMatchSnapshot();
    });
  });
});
