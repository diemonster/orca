import toastr from 'toastr';

const errorMiddleware = store => next => (action) => {
  if (action.error) {
    if (
      action.error.response
      && action.error.response.data
      && action.error.response.data.code
      && action.error.response.data.message
    ) {
      toastr.error(action.error.response.data.message, action.error.response.data.code);
    } else {
      toastr.error(action.error);
    }
  }

  next(action);
};

export default errorMiddleware;
