
import { createSelectorCreator, defaultMemoize } from 'reselect';

const notset = {};


export function changeMemoize(func, changeCallback, memoize, ...memoizeOptions) {
  const memoizeFunction = memoize || defaultMemoize;

  const memoizeInstance = memoizeFunction(func, ...memoizeOptions);
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
  let logName = name || 'unknown';
  logName = `- ${logName}`;

  return (lastArgs, lastResult, newArgs, newResult) => {
    // eslint-disable-next-line no-console
    console.log(
      logName,
      '\n\tlastArgs:', lastArgs,
      '\n\tlastResult:', lastResult,
      '\n\tnewArgs:', newArgs,
      '\n\tnewResult:', newResult
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
