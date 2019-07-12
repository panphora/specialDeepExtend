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

let obj1 = {
  timelines: [
    {id: "1", text: "1"},
    {id: "2", text: "2"},
    {id: "3", text: "3"}
  ],
  other: "y"
};

let obj2 = {
  timelines: [
    {id: "1", text: "1", notes: "awesome!"},
    {id: "2", text: "different"},
    {id: "4", text: "4"}
  ],
  other: "x",
  extra: []
};

// specialDeepExtend uses ids to extend, add, or remove array items
let output = specialDeepExtend(obj1, obj2);

// expected:

output === {
  timelines: [
    {id: "1", text: "1", notes: "awesome!"},
    {id: "2", text: "different"},
    {id: "4", text: "4"}
  ],
  other: "x",
  extra: []
};

// object with id 1 has the notes key added to it
// object with id 2 is changed
// object with id 3 is removed
// object with id 4 is added (to the end of the array)
// other prop is changed
// extra prop is added on
// not shown: nested data is also deep extended using specialDeepExtend



// specialDeepReplace uses ids to extend, add, or remove array items
// # rules:
//   - objects can contain arrays or strings in their keys
//   - arrays can only contain objects, not strings or other primitives
function specialDeepExtend (sourceOriginal, targetOriginal) {
  // copy the data, so it's not modified
  sourceOriginal = JSON.parse(JSON.stringify(sourceOriginal));
  targetOriginal = JSON.parse(JSON.stringify(targetOriginal));
  _specialDeepExtend(sourceOriginal, targetOriginal);
}

// this function will modify data, while the parent specialDeepExtend will not
function _specialDeepExtend (source, target, parentKey, parent) {
  let sourceType = getDataType(source);
  let targetType = getDataType(target);

  if (targetType === "array") {
    target.forEach((targetItem) => {
      let matchingSourceItem = source.find(sourceItem => sourceItem.id === targetItem.id);
      if (matchingSourceItem) {
        _insertMissingKeyValuePairs(targetItem, matchingSourceItem);
      }
    });

    if (parent) {
      parent[parentKey] = target;
    } else {
      source = target;
    }
  } else if (targetType === "object") {
    _insertMissingKeyValuePairs(source, target);

    forEachKeyValuePair(target, (key, targetValue) => {
      let targetValueType = getDataType(targetValue);

      if (targetValueType === "array" || targetValueType === "object") {
        _specialDeepExtend(source[key], targetValue, key, source);
      }
    });
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





























