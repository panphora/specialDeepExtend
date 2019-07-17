// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/deep-equal/lib/keys.js":[function(require,module,exports) {
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],"node_modules/deep-equal/lib/is_arguments.js":[function(require,module,exports) {
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],"node_modules/deep-equal/index.js":[function(require,module,exports) {
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/keys.js":"node_modules/deep-equal/lib/keys.js","./lib/is_arguments.js":"node_modules/deep-equal/lib/is_arguments.js"}],"specialDeepExtend.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = specialDeepExtend;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isObject = function isObject(a) {
  return _typeof(a) === "object" && a !== null && !Array.isArray(a);
};

var isArray = function isArray(a) {
  return Array.isArray(a);
};

var forEachKeyValuePair = function forEachKeyValuePair(obj, cb) {
  Object.keys(obj).forEach(function (k) {
    cb(k, obj[k]);
  });
};

var fillMissingKeys = function fillMissingKeys(target, source) {
  forEachKeyValuePair(source, function (key, value) {
    if (target[key] === undefined) {
      target[key] = value;
    }
  });
};

var findById = function findById(arrayToSearch, objWithId) {
  return arrayToSearch.find(function (a) {
    return a.id === objWithId.id;
  });
}; // this will modify target, filling in data from source, using an `id` key to find matching objects inside arrays
//   this function assumes source and target are of the same type (even in recursive loops)


function specialDeepExtend(source, target) {
  if (isArray(target)) {
    // loop through children of target data
    target.forEach(function (targetChild) {
      // for each child, find match in source data using the id
      var matchingSourceChild = findById(source, targetChild); // if source data found

      if (matchingSourceChild) {
        // call this function recursively on the child and matching child
        specialDeepExtend(targetChild, matchingSourceChild); // fill missing keys in the target data using the source data

        fillMissingKeys(targetChild, matchingSourceChild);
      }
    });
  }

  if (isObject(target)) {
    // for each key/value pair in target data
    forEachKeyValuePair(target, function (key, targetValue) {
      // if value is an object or array in BOTH the source AND target data
      var sourceValue = source[key];

      if ((isObject(sourceValue) || isArray(sourceValue)) && (isObject(targetValue) || isArray(targetValue))) {
        // call this function recursively on these children
        specialDeepExtend(sourceValue, targetValue);
      }
    }); // fill missing keys in the target data using the source data

    fillMissingKeys(target, source);
  }

  return target;
}
},{}],"tests.js":[function(require,module,exports) {
"use strict";

var _specialDeepExtend = _interopRequireDefault(require("./specialDeepExtend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deepEqual = require('deep-equal');

var testSourceObjects = [{
  timelines: [{
    id: "1",
    text: "1"
  }, {
    id: "2",
    text: "2",
    extra: "a"
  }, {
    id: "3",
    text: "3"
  }],
  other: "y"
}, {
  list: [{
    id: "1",
    data: "a",
    children: [{
      id: "2",
      data: "b",
      extraData: "h",
      children: [{
        id: "3",
        data: "c"
      }]
    }]
  }]
}, {
  id: "6",
  text: "a",
  choices: [{
    id: "1",
    choiceText: "b",
    choices: [{
      id: "3",
      choiceText: "d",
      choices: []
    }]
  }, {
    id: "2",
    choiceText: "c",
    choices: [{
      id: "4",
      choiceText: "e",
      choices: []
    }]
  }]
}, [{
  id: "1",
  children: [{
    id: "2",
    extraData: "h"
  }]
}]];
var testTargetObjects = [{
  timelines: [{
    id: "1",
    text: "1",
    notes: ["a", "b", "c"]
  }, {
    id: "2",
    text: "different"
  }, {
    id: "4",
    text: "4"
  }],
  other: "x",
  extra: []
}, {
  list: [{
    id: "1",
    data: "z",
    children: [{
      id: "2",
      data: "y",
      extraData: "h",
      children: [{
        id: "3",
        data: "x"
      }]
    }]
  }]
}, {
  id: "6",
  text: "a",
  choices: [{
    id: "1",
    choiceText: "bbbb"
  }, {
    id: "2",
    choiceText: "cccc"
  }]
}, [{
  id: "1",
  children: [{
    id: "2"
  }]
}]];
var testExpectedOutputs = [// Explanation of the first expected output: 
// - object with id 1 has the notes key added to it
// - object with id 2 is changed
// - object with id 3 is removed
// - object with id 4 is added (to the end of the array)
// - other prop is changed
// - extra prop is added on
// - not shown: nested data is also deep extended using specialDeepExtend
{
  timelines: [{
    id: "1",
    text: "1",
    notes: ["a", "b", "c"]
  }, {
    id: "2",
    text: "different",
    extra: "a"
  }, {
    id: "4",
    text: "4"
  }],
  other: "x",
  extra: []
}, {
  list: [{
    id: "1",
    data: "z",
    children: [{
      id: "2",
      data: "y",
      extraData: "h",
      children: [{
        id: "3",
        data: "x"
      }]
    }]
  }]
}, {
  id: "6",
  text: "a",
  choices: [{
    id: "1",
    choiceText: "bbbb",
    choices: [{
      id: "3",
      choiceText: "d",
      choices: []
    }]
  }, {
    id: "2",
    choiceText: "cccc",
    choices: [{
      id: "4",
      choiceText: "e",
      choices: []
    }]
  }]
}, [{
  id: "1",
  children: [{
    id: "2",
    extraData: "h"
  }]
}]];
testSourceObjects.forEach(function (testSourceObject, i) {
  var testTargetObject = testTargetObjects[i];
  var testExpectedOutput = testExpectedOutputs[i];
  var output = (0, _specialDeepExtend.default)(testSourceObject, testTargetObject);
  console.log("test ".concat(i, ":"), deepEqual(output, testExpectedOutput) ? "PASSED" : "FAILED");
  console.log(1, JSON.stringify(output));
  console.log(2, JSON.stringify(testExpectedOutput));
});
},{"deep-equal":"node_modules/deep-equal/index.js","./specialDeepExtend":"specialDeepExtend.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./tests");
},{"./tests":"tests.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map