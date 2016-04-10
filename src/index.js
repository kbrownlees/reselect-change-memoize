
import { createSelectorCreator, defaultMemoize } from 'reselect';

const notset = {};


export function changeMemoize(func, changeCallback, memoize) {
  const memoizeFunction = memoize || defaultMemoize;

  const memoizeInstance = memoizeFunction(func);
  if (changeCallback === undefined) {
    return memoizeInstance;
  }

  let lastArgs = notset;
  let lastResult = notset;
  return (...args) => {
    const result = memoizeInstance(...args);
    if (result !== lastResult || lastResult === notset) {
      changeCallback(lastArgs, lastResult, args, result);
      lastResult = result;
      lastArgs = args;
    }

    return result;
  };
}

export function createSelectorWithChangeCallback(callback, ...args) {
  return createSelectorCreator(changeMemoize, callback)(...args);
}

function logNamedChange(name) {
  return (lastArgs, lastResult, newArgs, newResult) => {
    // eslint-disable-next-line no-console
    console.log(
      name || 'unknown', '\n',
      '\t', 'lastArgs:', lastArgs, '\n',
      '\t', 'lastResult:', lastResult, '\n',
      '\t', 'newArgs:', newArgs, '\n',
      '\t', 'newResult:', newResult, '\n'
    );
  };
}

export function createSelector(...args) {
  let name;
  if (typeof(args[0]) === 'string') {
    name = args.shift();
  }

  let changeCallback;
  if (process.env.NODE_ENV !== 'production') {
    changeCallback = logNamedChange(name);
  }

  return createSelectorWithChangeCallback(changeCallback, ...args);
}
