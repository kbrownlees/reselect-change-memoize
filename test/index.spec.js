import expect from 'expect';

import { createSelectorCreator } from 'reselect';
import { changeMemoize, createSelector, createSelectorWithChangeCallback } from '../src';

describe('createSelectorWithChangeCallback', () => {
  it('Code for README', () => {
    // eslint-disable-next-line no-unused-vars
    function myCallback(lastArgs, lastResult, newArgs, newResult) {
      // Your code
    }

    const selector = createSelectorWithChangeCallback(
      myCallback,
      (state) => state,
      (state) => { // eslint-disable-line arrow-body-style
        return { state };
      }
    );

    selector({ initial: 'state' });
  });

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
    // The name doesn't not have to be provided
    const selector3 = createSelector(
      (state) => state,
      (state) => { // eslint-disable-line arrow-body-style
        return { selector3: state };
      }
    );

    selector2({ initial: 'state' });
    selector1({ second: 'state' });
    selector3({ second: 'state' });
  });
});

describe('createSelectorCreator', () => {
  it('code for README', () => {
    // eslint-disable-next-line no-unused-vars
    function myCallback(lastArgs, lastResult, newArgs, newResult) {
      // Your code
      // eslint-disable-next-line no-console
      console.log(newResult);
    }

    // eslint-disable-next-line no-shadow
    const createSelector = createSelectorCreator(changeMemoize, myCallback);

    const selector = createSelector(
      (state) => state,
      (state) => { // eslint-disable-line arrow-body-style
        return { selector: state };
      }
    );

    selector({ initial: 'state' });
  });
});
