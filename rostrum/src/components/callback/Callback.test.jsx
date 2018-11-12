import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Callback from './Callback';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Callback', () => {
    it('should render itself', () => {
      const callback = shallow(<Callback />);

      expect(callback.find('div').hasClass('container')).toBe(true);
      expect(callback.find('h4').text()).toEqual('Loading...');
    });
  });
});
