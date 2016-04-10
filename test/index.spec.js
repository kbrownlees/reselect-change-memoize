import expect from 'expect';
import { createSelector, createSelectorWithChangeCallback } from '../src';

describe('createSelectorWithChangeCallback', () => {
  it('Should callback when a value changes', () => {
    let calls = 0;
    const selector = createSelectorWithChangeCallback(
      () => { calls += 1 },
      (state) => state,
      (state) => { // eslint-disable-line arrow-body-style
        return { state };
      }
    );

    let state = {};
    selector(state);
    expect(calls).toBe(1);
    selector(state);
    expect(calls).toBe(1);
    state = { something: 'different' };
    selector(state);
    expect(calls).toBe(2);
  });
});

describe('createSelector', () => {
  it('Output for README', () => {
    const selector1 = createSelector(
      'An awesome selector',
      (state) => state,
      (state) => { // eslint-disable-line arrow-body-style
        return { selector1: state };
      }
    );
    const selector2 = createSelector(
      'A second awesome selector which uses the first awesome selector',
      selector1,
      (state) => { // eslint-disable-line arrow-body-style
        return { selector2: state };
      }
    );

    selector2({ initial: 'state' });
    selector1({ second: 'state' });
  });
});
