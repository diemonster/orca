import * as actions from './namespaces';
import * as types from './actionTypes';

describe('actions', () => {
  it('should create an action to create a namespace', () => {
    const name = 'new-namespace';
    const expectedAction = {
      type: types.NAMESPACE_CREATE,
      name,
    };

    expect(actions.namespaceCreate(name)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to change the "create namespace" input', () => {
    const namespaceCreateInput = 'a';
    const expectedAction = {
      type: types.NAMESPACE_CREATE_CHANGE_INPUT,
      namespaceCreateInput,
    };

    expect(actions.namespaceCreateChangeInput(namespaceCreateInput)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to delete a namespace', () => {
    const name = 'some-namespace';
    const expectedAction = {
      type: types.NAMESPACE_DELETE,
      name,
    };

    expect(actions.namespaceDelete(name)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to change the "delete namespace" input', () => {
    const namespaceDeleteInput = 'a';
    const expectedAction = {
      type: types.NAMESPACE_DELETE_CHANGE_INPUT,
      namespaceDeleteInput,
    };

    expect(actions.namespaceDeleteChangeInput(namespaceDeleteInput)).toEqual(expectedAction);
  });
});

describe('actions', () => {
  it('should create an action to list namespaces', () => {
    const expectedAction = {
      type: types.NAMESPACE_LIST,
    };

    expect(actions.namespaceList()).toEqual(expectedAction);
  });
});
