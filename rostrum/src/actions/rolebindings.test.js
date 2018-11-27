import * as actions from './rolebindings';
import * as types from './actionTypes';

describe('actions', () => {
  describe('rolebindingList', () => {
    it('should create an action to list rolebindings', () => {
      const expectedAction = {
        type: types.ROLEBINDING_LIST,
      };

      expect(actions.rolebindingList()).toEqual(expectedAction);
    });

    describe('rolebindingCreateError', () => {
      it('should emit an appropriate action', () => {
        const error = new Error();
        const expectedAction = {
          type: types.ROLEBINDING_CREATE_ERROR,
          error,
        };

        expect(actions.rolebindingCreateError(error)).toEqual(expectedAction);
      });
    });

    describe('rolebindingListError', () => {
      it('should emit an appropriate action', () => {
        const error = new Error();
        const expectedAction = {
          type: types.ROLEBINDING_LIST_ERROR,
          error,
        };

        expect(actions.rolebindingListError(error)).toEqual(expectedAction);
      });
    });

    describe('rolebindingListSuccess', () => {
      it('should emit an appropriate action', () => {
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
