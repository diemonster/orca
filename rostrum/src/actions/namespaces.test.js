import * as actions from './namespaces';
import * as types from './actionTypes';


describe('actions', () => {
  describe('namespaceCreate', () => {
    it('should create an action to create a namespace', () => {
      const name = 'new-namespace';
      const expectedAction = {
        type: types.NAMESPACE_CREATE,
        name,
      };

      expect(actions.namespaceCreate(name)).toEqual(expectedAction);
    });
  });

  describe('namespaceCreateError', () => {
    it('should emit an appropriate action', () => {
      const error = new Error();
      const expectedAction = {
        type: types.NAMESPACE_CREATE_ERROR,
        error,
      };

      expect(actions.namespaceCreateError(error)).toEqual(expectedAction);
    });
  });

  describe('namespaceCreateChangeInput', () => {
    it('should create an action to change the "create namespace" input', () => {
      const namespaceCreateInput = 'a';
      const expectedAction = {
        type: types.NAMESPACE_CREATE_CHANGE_INPUT,
        namespaceCreateInput,
      };

      expect(actions.namespaceCreateChangeInput(namespaceCreateInput)).toEqual(expectedAction);
    });
  });

  describe('namespaceDelete', () => {
    it('should create an action to delete a namespace', () => {
      const name = 'some-namespace';
      const expectedAction = {
        type: types.NAMESPACE_DELETE,
        name,
      };

      expect(actions.namespaceDelete(name)).toEqual(expectedAction);
    });
  });

  describe('namespaceDeleteError', () => {
    it('should emit an appropriate action', () => {
      const error = new Error();
      const expectedAction = {
        type: types.NAMESPACE_DELETE_ERROR,
        error,
      };

      expect(actions.namespaceDeleteError(error)).toEqual(expectedAction);
    });

    describe('namespaceList', () => {
      it('should create an action to list namespaces', () => {
        const expectedAction = {
          type: types.NAMESPACE_LIST,
        };

        expect(actions.namespaceList()).toEqual(expectedAction);
      });
    });
  });

  describe('namespaceListError', () => {
    it('should emit an appropriate action', () => {
      const error = new Error();
      const expectedAction = {
        type: types.NAMESPACE_LIST_ERROR,
        error,
      };

      expect(actions.namespaceListError(error)).toEqual(expectedAction);
    });
  });

  describe('namespaceListSuccess', () => {
    it('should emit an appropriate action', () => {
      const namespaceObjects = [{ namespace: 'any' }];
      const expectedAction = {
        type: types.NAMESPACE_LIST_SUCCESS,
        namespaceObjects,
      };

      expect(actions.namespaceListSuccess(namespaceObjects)).toEqual(expectedAction);
    });
  });

  describe('namespaceWatchForDeletion', () => {
    it('should emit an appropriate action', () => {
      const name = 'some-namespace';
      const expectedAction = {
        type: types.NAMESPACE_WATCH_FOR_DELETION,
        name,
      };

      expect(actions.namespaceWatchForDeletion(name)).toEqual(expectedAction);
    });
  });
});
