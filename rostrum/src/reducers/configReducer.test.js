import configReducer, { initialState } from './configReducer';


describe('config reducer', () => {
  it('should return the initial state', () => {
    expect(configReducer(undefined, {})).toEqual(initialState);
  });
});
