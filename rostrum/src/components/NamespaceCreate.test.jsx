import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NamespaceCreate } from './NamespaceCreate';

Enzyme.configure({ adapter: new Adapter() });

describe('components', () => {
  let props;

  beforeEach(() => {
    props = {
      dispatchNamespaceCreate: jest.fn(),
      dispatchNamespaceCreateChangeInput: jest.fn(),
      namespaceCreateInput: '',
      username: '',
    };
  });

  describe('NamespaceCreate', () => {
    it('should render itself and its subcomponents', () => {
      const namespaceCreate = shallow(<NamespaceCreate {...props} />);
      expect(namespaceCreate).toMatchSnapshot();
    });

    describe('methods', () => {
      it('handleChange dispatches an action when input changes', () => {
        const event = { preventDefault: jest.fn(), target: { value: 'a' } };
        const namespaceCreate = shallow(<NamespaceCreate {...props} />);
        namespaceCreate.find('input').simulate('change', event);
        expect(props.dispatchNamespaceCreateChangeInput).toBeCalledWith('a');
      });

      it('handleSubmit dispatches an action when form is submitted', () => {
        props.namespaceCreateInput = 'new-namespace';
        props.username = 'username';

        const event = { preventDefault: jest.fn(), target: { value: 'new-namespace' } };
        const namespaceCreate = shallow(<NamespaceCreate {...props} />);
        namespaceCreate.find('form').simulate('submit', event);
        expect(props.dispatchNamespaceCreate).toBeCalledWith('new-namespace', 'username');
      });
    });
  });
});
