import * as actions from './roles';
import * as types from './actionTypes';

describe('actions', () => {
  describe('roleCreateError', () => {
    it('should emit an appropriate action', () => {
      const error = new Error();
      const expectedAction = {
        type: types.ROLE_CREATE_ERROR,
        error,
      };

      expect(actions.roleCreateError(error)).toEqual(expectedAction);
    });
  });

  describe('roleGetError', () => {
    it('should emit an appropriate action', () => {
      const error = new Error();
      const expectedAction = {
        type: types.ROLE_GET_ERROR,
        error,
      };

      expect(actions.roleGetError(error)).toEqual(expectedAction);
    });
  });
});
