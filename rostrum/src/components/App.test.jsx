import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import App from './App';
import Sidebar from './sidebar/Sidebar';
import Namespace from './namespaces/Namespace';
import Pod from './pods/Pod';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('App', () => {
    it('should render itself and its subcomponents', () => {
      const app = shallow(<App />);

      expect(app.find(Router).exists()).toBe(true);
      expect(app.find(Router).childAt(0)).toEqual(app.find('div').at(0));
      expect(app.find('div').at(0).hasClass('app-container')).toBe(true);
      expect(app.find('h1').text()).toEqual('Orca: the Kubernetes permissions manager');
      expect(app.find('div').at(1).hasClass('kube-container')).toBe(true);
      expect(app.find(Sidebar).exists()).toBe(true);
      expect(app.find(Switch).exists()).toBe(true);
      const routes = app.find(Switch).children();
      expect(routes.length).toEqual(3);
      expect(routes.at(0).prop('path')).toEqual('/namespace/');
      expect(routes.at(0).prop('component')).toEqual(Namespace);
      expect(routes.at(1).prop('path')).toEqual('/pod/');
      expect(routes.at(1).prop('component')).toEqual(Pod);
    });
  });
});
