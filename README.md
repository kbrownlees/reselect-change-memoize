Reselect Change Memoize
=======================
[![Build Status](https://travis-ci.org/kbrownlees/reselect-change-memoize.svg?branch=master)](https://travis-ci.org/kbrownlees/reselect-change-memoize)
[![npm version](https://badge.fury.io/js/reselect-change-memoize.svg)](https://badge.fury.io/js/reselect-change-memoize)

A simple memoize function for reselect which performs a callback everytime the result changes.
* a changeMemoize
* createSelectorWithChangeCallback allows you to easily substitute createSelector
* a createSelector helper which enables change logging if not in production and allows you to name selectors


```js
import { createSelectorCreator } from 'reselect';
import { changeMemoize } from 'reselect-change-memoize';

const myCallback = function(lastArgs, lastResult, newArgs, newResult) {
  // Your code
};

const createSelector = createSelectorCreator(changeMemoize, myCallback);
```

```js
import { createSelectorWithChangeCallback } from 'reselect-change-memoize';

const myCallback = function(lastArgs, lastResult, newArgs, newResult) {
  // Your code
};

const selector = createSelectorWithChangeCallback(
  myCallback,
  (state) => state,
  (state) => {
    return { state };
  }
);

selector({ initial: 'state' });
```

Alternatively, to use the inbuilt logging create selector, simply import createSelector from
reselect-change-memoize rather than reselect.

```js
import { createSelector } from 'reselect-change-memoize';

const selector1 = createSelector(
  'An awesome selector',
  (state) => state,
  (state) => {
    return { selector1: state };
  }
);
const selector2 = createSelector(
  'A second awesome selector which uses the first awesome selector',
  selector1,
  (state) => {
    return { selector2: state };
  }
);
// The name doesn't have to be provided
const selector3 = createSelector(
  selector1,
  (state) => {
    return { selector2: state };
  }
);
selector2({ initial: 'state' });
selector1({ second: 'state' });
selector3({ second: 'state' });
```

produces

```
- An awesome selector 
	lastArgs: {} 
	lastResult: {} 
	newArgs: [ { initial: 'state' } ] 
	newResult: { selector1: { initial: 'state' } }
- A second awesome selector which uses the first awesome selector 
	lastArgs: {} 
	lastResult: {} 
	newArgs: [ { selector1: { initial: 'state' } } ] 
	newResult: { selector2: { selector1: { initial: 'state' } } }
- An awesome selector 
	lastArgs: [ { initial: 'state' } ] 
	lastResult: { selector1: { initial: 'state' } } 
	newArgs: [ { second: 'state' } ] 
	newResult: { selector1: { second: 'state' } }
- unknown 
	lastArgs: {} 
	lastResult: {} 
	newArgs: [ { second: 'state' } ] 
	newResult: { selector3: { second: 'state' } }
```
