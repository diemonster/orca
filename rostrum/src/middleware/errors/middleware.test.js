import toastr from 'toastr';
import errorMiddleware from './middleware';

const create = () => {
  const store = {};
  const next = jest.fn();
  const invoke = action => errorMiddleware(store)(next)(action);

  return {
    store, next, invoke,
  };
};

describe('error middleware', () => {
  it('does not emit a toastr error for an errorless action', () => {
    const { next, invoke } = create();
    const action = { type: 'EVERYTHING_IS_FINE' };

    const toastrError = jest.spyOn(toastr, 'error');

    invoke(action);

    expect(toastrError).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('emits a well-formed toastr error', () => {
    const { next, invoke } = create();
    const action = { error: { response: { data: { code: '500', message: 'it broke' } } } };

    const toastrError = jest.spyOn(toastr, 'error');

    invoke(action);

    expect(toastrError).toHaveBeenCalledWith('it broke', '500');
    expect(next).toHaveBeenCalledWith(action);
  });

  it('emits a generic toastr error', () => {
    const { next, invoke } = create();
    const action = { error: 'some error of a different format than an expected API error' };

    const toastrError = jest.spyOn(toastr, 'error');

    invoke(action);

    expect(toastrError).toHaveBeenCalledWith(action.error);
    expect(next).toHaveBeenCalledWith(action);
  });
});
