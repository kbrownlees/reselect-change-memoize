# Reselect Change Memoize

[![Build Status](https://travis-ci.org/kbrownlees/reselect-change-memoize.svg?branch=master)](https://travis-ci.org/kbrownlees/reselect-change-memoize)
[![npm version](https://badge.fury.io/js/reselect-change-memoize.svg)](https://badge.fury.io/js/reselect-change-memoize)

A simple memoize function for reselect which performs a callback everytime the result changes.

This package contains three exports:
* a changeMemoize
* createSelectorWithChangeCallback which allows you to easily substitute createSelector
* a createSelector helper which enables change logging if not in production and allows you to name selectors

## changeMemoize

```js
import { createSelectorCreator } from 'reselect';
import { changeMemoize } from 'reselect-change-memoize';

const myCallback = function(lastArgs, lastResult, newArgs, newResult) {
  // Your code
};

const createSelector = createSelectorCreator(changeMemoize, myCallback);
```

## createSelectorWithChangeCallback

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

## createSelector

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
- An awesome selector (0.06ms)
  lastArgs {}
  lastResult {}
  newArgs [ { initial: 'state' } ]
  newResult { selector1: { initial: 'state' } }
- A second awesome selector which uses the first awesome selector (0.05ms)
  lastArgs {}
  lastResult {}
  newArgs [ { selector1: { initial: 'state' } } ]
  newResult { selector2: { selector1: { initial: 'state' } } }
- An awesome selector (0.01ms)
  lastArgs [ { initial: 'state' } ]
  lastResult { selector1: { initial: 'state' } }
  newArgs [ { second: 'state' } ]
  newResult { selector1: { second: 'state' } }
- unknown (0.03ms)
  lastArgs {}
  lastResult {}
  newArgs [ { second: 'state' } ]
  newResult { selector3: { second: 'state' } }
```
