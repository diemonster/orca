import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Namespace from './Namespace';
import NamespaceCreate from './NamespaceCreate';
import NamespaceDelete from './NamespaceDelete';
import NamespaceList from './NamespaceList';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  describe('Namespace', () => {
    it('should render itself and its subcomponents', () => {
      const namespace = shallow(<Namespace />);
      const div = namespace.find('div');

      expect(div.hasClass('kube-display')).toBe(true);
      expect(div.children().length).toEqual(3);
      expect(div.childAt(0)).toEqual(namespace.find(NamespaceList));
      expect(div.childAt(1)).toEqual(namespace.find(NamespaceCreate));
      expect(div.childAt(2)).toEqual(namespace.find(NamespaceDelete));
    });
  });
});
