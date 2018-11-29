import * as actions from './namespaces';
import * as types from './actionTypes';


describe('actions', () => {
  describe('namespaceCreate', () => {
    it('should return an action to create a namespace', () => {
      const namespace = 'new-namespace';
      const expectedAction = {
        type: types.NAMESPACE_CREATE,
        namespace,
      };

      expect(actions.namespaceCreate(namespace)).toEqual(expectedAction);
    });
  });

  describe('namespaceCreateChangeInput', () => {
    it('should return an action to change the "create namespace" input', () => {
      const namespaceCreateInput = 'a';
      const expectedAction = {
        type: types.NAMESPACE_CREATE_CHANGE_INPUT,
        namespaceCreateInput,
      };

      expect(actions.namespaceCreateChangeInput(namespaceCreateInput)).toEqual(expectedAction);
    });
  });

  describe('namespaceCreateError', () => {
    it('should return an action to display an error', () => {
      const error = new Error();
      const expectedAction = {
        type: types.NAMESPACE_CREATE_ERROR,
        error,
      };

      expect(actions.namespaceCreateError(error)).toEqual(expectedAction);
    });
  });

  describe('namespaceDelete', () => {
    it('should return an action to delete a namespace', () => {
      const namespace = 'some-namespace';
      const expectedAction = {
        type: types.NAMESPACE_DELETE,
        namespace,
      };

      expect(actions.namespaceDelete(namespace)).toEqual(expectedAction);
    });
  });

  describe('namespaceDeleteCheckWatch', () => {
    it('should return an action to check a namespace for deletion', () => {
      const namespace = 'some-namespace';
      const stop = jest.fn();
      const expectedAction = {
        type: types.NAMESPACE_DELETE_CHECK_WATCH,
        namespace,
        stop,
      };

      expect(actions.namespaceDeleteCheckWatch(namespace, stop)).toEqual(expectedAction);
    });
  });

  describe('namespaceDeleteError', () => {
    it('should return an action to display an error', () => {
      const error = new Error();
      const expectedAction = {
        type: types.NAMESPACE_DELETE_ERROR,
        error,
      };

      expect(actions.namespaceDeleteError(error)).toEqual(expectedAction);
    });

    describe('namespaceDeleteStartWatch', () => {
      it('should return an action to start watching a namespace for deletion', () => {
        const namespace = 'some-namespace';
        const interval = 10;
        const expectedAction = {
          type: types.NAMESPACE_DELETE_START_WATCH,
          namespace,
          interval,
        };

        expect(
          actions.namespaceDeleteStartWatch(namespace, interval),
        ).toEqual(expectedAction);
      });
    });

    describe('namespaceDeleteStopWatch', () => {
      it('should return an action to stop watching a namespace for deletion', () => {
        const stop = jest.fn();
        const expectedAction = {
          type: types.NAMESPACE_DELETE_STOP_WATCH,
          stop,
        };

        expect(actions.namespaceDeleteStopWatch(stop)).toEqual(expectedAction);
      });
    });

    describe('namespaceList', () => {
      it('should return an action to list namespaces', () => {
        const expectedAction = {
          type: types.NAMESPACE_LIST,
        };

        expect(actions.namespaceList()).toEqual(expectedAction);
      });
    });
  });

  describe('namespaceListError', () => {
    it('should return an action to display an error', () => {
      const error = new Error();
      const expectedAction = {
        type: types.NAMESPACE_LIST_ERROR,
        error,
      };

      expect(actions.namespaceListError(error)).toEqual(expectedAction);
    });
  });

  describe('namespaceListSuccess', () => {
    it('should return an action to write namespaces to state', () => {
      const namespaceObjects = [{ namespace: 'any' }];
      const expectedAction = {
        type: types.NAMESPACE_LIST_SUCCESS,
        namespaceObjects,
      };

      expect(actions.namespaceListSuccess(namespaceObjects)).toEqual(expectedAction);
    });
  });

  describe('namespaceSelect', () => {
    it('should return an action to select a namespace', () => {
      const namespace = 'some-namespace';
      const expectedAction = {
        type: types.NAMESPACE_SELECT,
        namespace,
      };

      expect(actions.namespaceSelect(namespace)).toEqual(expectedAction);
    });
  });
});
