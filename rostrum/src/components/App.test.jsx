import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('App', () => {
    it('should render itself and its subcomponents', () => {
      const app = shallow(<App />);
      expect(app).toMatchSnapshot();
    });
  });
});
