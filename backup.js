const deepEqual = require('deep-equal');

let isObject = (a) => typeof a === "object" && a !== null && !Array.isArray(a);
let isArray = (a) => Array.isArray(a);
let getDataType = (a) => (
  (isObject(a))
    ? "object" 
    : (isArray(a))
    ? "array"
    : "other"
);
let forEachKeyValuePair = (obj, cb) => {
  Object.keys(obj).forEach(function (k) {
    cb(k, obj[k]);
  });
};
let deepCopy = (a) => JSON.parse(JSON.stringify(a));
let replaceArrayContents = (arr1, arr2) => arr1.splice(0, arr1.length, ...arr2);


// specialDeepReplace uses ids to extend, add, or remove array items
// # rules:
//   - objects can contain arrays or strings in their keys
//   - arrays can only contain objects, not strings or other primitives
function specialDeepExtend (sourceOriginal, targetOriginal) {
  // copy the data, so it's not modified
  sourceOriginal = deepCopy(sourceOriginal);
  targetOriginal = deepCopy(targetOriginal);
  return _specialDeepExtend(sourceOriginal, targetOriginal);
}

// this function will modify data, while the parent specialDeepExtend will not
function _specialDeepExtend (source, target, parentKey, parent, dontOverwriteKeysWithPlainValues) {
  let sourceType = getDataType(source);
  let targetType = getDataType(target);

  // if both data are NOT the same type, change the source data type to be the target data type
  if (sourceType !== targetType && (targetType === "object" || targetType === "array")) {
    if (parent) {
      parent[parentKey] = targetType === "object" ? {} : [];
    } else {
      source = targetType === "object" ? {} : [];
    }
  }

  if (targetType === "object") {

    forEachKeyValuePair(target, (key, targetValue) => {
      let targetValueType = getDataType(targetValue);

      if (targetValueType === "array" || targetValueType === "object") {
        _specialDeepExtend(source[key], targetValue, key, source);
      } else if (!dontOverwriteKeysWithPlainValues) {
        source[key] = targetValue;
      }
    });

    _insertMissingKeyValuePairs(source, target);

  } else if (targetType === "array") {

    target.forEach((targetItem) => {
      let matchingSourceItem = source.find(sourceItem => sourceItem.id === targetItem.id);
      if (matchingSourceItem) {
        _insertMissingKeyValuePairs(targetItem, matchingSourceItem);
        _specialDeepExtend(targetItem, matchingSourceItem, undefined, undefined, true);
      }
    });

    if (parent) {
      parent[parentKey] = target;
    } else {
      source = target;
    }

  }

  return source;
}

function _insertMissingKeyValuePairs (target, source) {
  forEachKeyValuePair(source, (key, value) => {
    if (target[key] === undefined) {
      target[key] = value;
    }
  });
}




























