import configReducer from './config';

describe('config reducer', () => {
  it('should return the initial state', () => {
    const initialState = {};
    expect(configReducer(undefined, {})).toEqual(initialState);
  });
});
