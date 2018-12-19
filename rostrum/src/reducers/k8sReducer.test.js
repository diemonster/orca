import k8sReducer, { initialState } from './k8sReducer';


describe('k8sReducer', () => {
  it('should return the initial state', () => {
    expect(k8sReducer(undefined, {})).toEqual(initialState);
  });
});
