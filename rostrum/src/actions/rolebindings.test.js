import * as actions from './rolebindings';
import * as types from './actionTypes';

describe('actions', () => {
  describe('rolebindingCreate', () => {
    it('should return an action to create a rolebinding', () => {
      const namespace = 'some-namespace';
      const role = 'some-role';
      const subject = 'some-subject';
      const expectedAction = {
        type: types.ROLEBINDING_CREATE,
        namespace,
        role,
        subject,
      };

      expect(actions.rolebindingCreate(namespace, role, subject)).toEqual(expectedAction);
    });
  });

  describe('rolebindingCreateError', () => {
    it('should return an action to display an error', () => {
      const error = new Error();
      const expectedAction = {
        type: types.ROLEBINDING_CREATE_ERROR,
        error,
      };

      expect(actions.rolebindingCreateError(error)).toEqual(expectedAction);
    });
  });

  describe('rolebindingList', () => {
    it('should return an action to list rolebindings', () => {
      const expectedAction = {
        type: types.ROLEBINDING_LIST,
      };

      expect(actions.rolebindingList()).toEqual(expectedAction);
    });

    describe('rolebindingListError', () => {
      it('should return an action to display an error', () => {
        const error = new Error();
        const expectedAction = {
          type: types.ROLEBINDING_LIST_ERROR,
          error,
        };

        expect(actions.rolebindingListError(error)).toEqual(expectedAction);
      });
    });

    describe('rolebindingListSuccess', () => {
      it('should return an action to write rolebindings to state', () => {
        const namespace = 'some-namespace';
        const rolebindings = ['rolebinding1', 'rolebinding2'];
        const expectedAction = {
          type: types.ROLEBINDING_LIST_SUCCESS,
          namespace,
          rolebindings,
        };

        expect(actions.rolebindingListSuccess(namespace, rolebindings)).toEqual(expectedAction);
      });
    });
  });
});
