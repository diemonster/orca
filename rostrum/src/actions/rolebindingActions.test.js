import * as actions from './rolebindingActions';
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

  describe('rolebindingDelete', () => {
    it('should return an action to delete a rolebinding', () => {
      const namespace = 'some-namespace';
      const rolebinding = 'some-rolebinding';
      const expectedAction = {
        type: types.ROLEBINDING_DELETE,
        namespace,
        rolebinding,
      };

      expect(actions.rolebindingDelete(namespace, rolebinding)).toEqual(expectedAction);
    });
  });

  describe('rolebindingDeleteCheckWatch', () => {
    it('should return an action to check a rolebinding for deletion', () => {
      const namespace = 'some-namespace';
      const rolebinding = 'some-rolebinding';
      const stop = jest.fn();
      const expectedAction = {
        type: types.ROLEBINDING_DELETE_CHECK_WATCH,
        namespace,
        rolebinding,
        stop,
      };

      expect(
        actions.rolebindingDeleteCheckWatch(namespace, rolebinding, stop),
      ).toEqual(expectedAction);
    });
  });

  describe('rolebindingDeleteError', () => {
    it('should return an action to display an error', () => {
      const error = Error();
      const expectedAction = {
        type: types.ROLEBINDING_DELETE_ERROR,
        error,
      };

      expect(actions.rolebindingDeleteError(error)).toEqual(expectedAction);
    });
  });

  describe('rolebindingDeleteStartWatch', () => {
    it('should return an action to start watching a rolebinding for deletion', () => {
      const namespace = 'some-namespace';
      const rolebinding = 'some-rolebinding';
      const interval = 10;
      const expectedAction = {
        type: types.ROLEBINDING_DELETE_START_WATCH,
        namespace,
        rolebinding,
        interval,
      };

      expect(
        actions.rolebindingDeleteStartWatch(namespace, rolebinding, interval),
      ).toEqual(expectedAction);
    });
  });

  describe('rolebindingDeleteStopWatch', () => {
    it('should return an action to stop watching a namespace for deletion', () => {
      const stop = jest.fn();
      const expectedAction = {
        type: types.ROLEBINDING_DELETE_STOP_WATCH,
        stop,
      };

      expect(actions.rolebindingDeleteStopWatch(stop)).toEqual(expectedAction);
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
