import * as actions from './rolebindings';
import * as types from './actionTypes';

describe('actions', () => {
  it('should create an action to list rolebindings', () => {
    const expectedAction = {
      type: types.ROLEBINDING_LIST,
    };

    expect(actions.rolebindingList()).toEqual(expectedAction);
  });
});
