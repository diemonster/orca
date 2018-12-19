import * as actions from './roleActions';
import * as types from './actionTypes';


describe('actions', () => {
  describe('roleCreate', () => {
    it('should return an action to create a role', () => {
      const namespace = 'some-namespace';
      const role = 'some-role';
      const expectedAction = {
        type: types.ROLE_CREATE,
        namespace,
        role,
      };

      expect(actions.roleCreate(namespace, role)).toEqual(expectedAction);
    });
  });

  describe('roleCreateError', () => {
    it('should return an action to display an error', () => {
      const error = new Error();
      const expectedAction = {
        type: types.ROLE_CREATE_ERROR,
        error,
      };

      expect(actions.roleCreateError(error)).toEqual(expectedAction);
    });
  });

  describe('roleGet', () => {
    it('should return an action to get a role', () => {
      const role = 'some-role';
      const expectedAction = {
        type: types.ROLE_GET,
        role,
      };

      expect(actions.roleGet(role)).toEqual(expectedAction);
    });
  });

  describe('roleGetError', () => {
    it('should return an action to display an error', () => {
      const error = new Error();
      const expectedAction = {
        type: types.ROLE_GET_ERROR,
        error,
      };

      expect(actions.roleGetError(error)).toEqual(expectedAction);
    });
  });
});
