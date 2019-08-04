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
})({"redditApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  search: function search(searchTerm) {
    return fetch("http://www.reddit.com/search.json?q=".concat(searchTerm, "&limit=100&sort=hot")).then(function (res) {
      return res.json();
    }).then(function (data) {
      return data.data.children.map(function (data) {
        return data.data;
      });
    }).catch(function (err) {
      return console.log(err);
    });
  }
};
exports.default = _default;
},{}],"node_modules/relative-time-format/modules/LocaleDataStore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultLocale = getDefaultLocale;
exports.setDefaultLocale = setDefaultLocale;
exports.getLocaleData = getLocaleData;
exports.addLocaleData = addLocaleData;
// Fallback locale.
// (when not a single one of the supplied "preferred" locales is available)
var defaultLocale = 'en'; // For all locales added
// their relative time formatter messages will be stored here.

var localesData = {};

function getDefaultLocale() {
  return defaultLocale;
}

function setDefaultLocale(locale) {
  defaultLocale = locale;
} // export function isLocaleDataAvailable(locale) {
//  return localesData.hasOwnProperty(locale)
// }


function getLocaleData(locale) {
  return localesData[locale];
}

function addLocaleData(localeData) {
  if (!localeData) {
    throw new Error('No locale data passed');
  } // This locale data is stored in a global variable
  // and later used when calling `.format(time)`.


  localesData[localeData.locale] = localeData;
}
},{}],"node_modules/relative-time-format/modules/resolveLocale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveLocale;
exports.resolveLocaleLookup = resolveLocaleLookup;

var _LocaleDataStore = require("./LocaleDataStore");

/**
 * Resolves a locale to a supported one (if any).
 * @param  {string} locale
 * @param {Object} [options] - An object that may have the following property:
 * @param {string} [options.localeMatcher="lookup"] - The locale matching algorithm to use. Possible values are "lookup" and "best fit". Currently only "lookup" is supported.
 * @return {string} [locale]
 * @example
 * // Returns "sr"
 * resolveLocale("sr-Cyrl-BA")
 * // Returns `undefined`
 * resolveLocale("xx-Latn")
 */
function resolveLocale(locale) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var localeMatcher = options.localeMatcher || 'lookup';

  switch (localeMatcher) {
    case 'lookup':
      return resolveLocaleLookup(locale);
    // "best fit" locale matching is not supported.
    // https://github.com/catamphetamine/relative-time-format/issues/2

    case 'best fit':
      // return resolveLocaleBestFit(locale)
      return resolveLocaleLookup(locale);

    default:
      throw new RangeError("Invalid \"localeMatcher\" option: ".concat(localeMatcher));
  }
}
/**
 * Resolves a locale to a supported one (if any).
 * Starts from the most specific locale and gradually
 * falls back to less specific ones.
 * This is a basic implementation of the "lookup" algorithm.
 * https://tools.ietf.org/html/rfc4647#section-3.4
 * @param  {string} locale
 * @return {string} [locale]
 * @example
 * // Returns "sr"
 * resolveLocaleLookup("sr-Cyrl-BA")
 * // Returns `undefined`
 * resolveLocaleLookup("xx-Latn")
 */


function resolveLocaleLookup(locale) {
  if ((0, _LocaleDataStore.getLocaleData)(locale)) {
    return locale;
  } // `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.


  var parts = locale.split('-');

  while (locale.length > 1) {
    parts.pop();
    locale = parts.join('-');

    if ((0, _LocaleDataStore.getLocaleData)(locale)) {
      return locale;
    }
  }
}
},{"./LocaleDataStore":"node_modules/relative-time-format/modules/LocaleDataStore.js"}],"node_modules/relative-time-format/modules/RelativeTimeFormat.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UNITS = void 0;

var _LocaleDataStore = require("./LocaleDataStore");

var _resolveLocale = _interopRequireDefault(require("./resolveLocale"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

// Valid time units.
var UNITS = ["second", "minute", "hour", "day", "week", "month", "quarter", "year"]; // Valid values for the `numeric` option.

exports.UNITS = UNITS;
var NUMERIC_VALUES = ["auto", "always"]; // Valid values for the `style` option.

var STYLE_VALUES = ["long", "short", "narrow"];
/**
 * Polyfill for `Intl.RelativeTimeFormat` proposal.
 * https://github.com/tc39/proposal-intl-relative-time
 * https://github.com/tc39/proposal-intl-relative-time/issues/55
 */

var RelativeTimeFormat =
/*#__PURE__*/
function () {
  /**
   * @param {(string|string[])} [locales] - Preferred locales (or locale).
   * @param {Object} [options] - Formatting options.
   * @param {string} [options.style="long"] - One of: "long", "short", "narrow".
   * @param {string} [options.numeric="always"] - (Version >= 2) One of: "always", "auto".
   * @param {string} [options.localeMatcher="lookup"] - One of: "lookup", "best fit". Currently only "lookup" is supported.
   */
  function RelativeTimeFormat() {
    var locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, RelativeTimeFormat);

    _defineProperty(this, "numeric", "always");

    _defineProperty(this, "style", "long");

    _defineProperty(this, "localeMatcher", "lookup");

    var numeric = options.numeric,
        style = options.style,
        localeMatcher = options.localeMatcher; // Set `numeric` option.

    if (numeric) {
      if (NUMERIC_VALUES.indexOf(numeric) < 0) {
        throw new RangeError("Invalid \"numeric\" option: ".concat(numeric));
      }

      this.numeric = numeric;
    } // Set `style` option.


    if (style) {
      if (STYLE_VALUES.indexOf(style) < 0) {
        throw new RangeError("Invalid \"style\" option: ".concat(style));
      }

      this.style = style;
    } // Set `localeMatcher` option.


    if (localeMatcher) {
      this.localeMatcher = localeMatcher;
    } // Set `locale`.
    // Convert `locales` to an array.


    if (typeof locales === 'string') {
      locales = [locales];
    } // Add default locale.


    locales.push((0, _LocaleDataStore.getDefaultLocale)()); // Choose the most appropriate locale.

    this.locale = RelativeTimeFormat.supportedLocalesOf(locales, {
      localeMatcher: this.localeMatcher
    })[0];

    if (!this.locale) {
      throw new TypeError("No supported locale was found");
    }

    this.locale = (0, _resolveLocale.default)(this.locale, {
      localeMatcher: this.localeMatcher
    }); // Use `Intl.NumberFormat` for formatting numbers (when available).

    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      this.numberFormat = new Intl.NumberFormat(this.locale);
    }
  }
  /**
   * Formats time `value` in `units` (either in past or in future).
   * @param {number} value - Time interval value.
   * @param {string} unit - Time interval measurement unit.
   * @return {string}
   * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
   * @example
   * // Returns "2 days ago"
   * rtf.format(-2, "day")
   * // Returns "in 5 minutes"
   * rtf.format(5, "minute")
   */


  _createClass(RelativeTimeFormat, [{
    key: "format",
    value: function format(value, unit) {
      return this.getRule(value, unit).replace('{0}', this.formatNumber(Math.abs(value)));
    }
    /**
     * Formats time `value` in `units` (either in past or in future).
     * @param {number} value - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @return {Object[]} The parts (`{ type, value }`).
     * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
     * @example
     * // Version 1.
     * // Returns [
     * //   { type: "literal", value: "in " },
     * //   { type: "day", value: "100" },
     * //   { type: "literal", value: " days" }
     * // ]
     * rtf.formatToParts(100, "day")
     * //
     * // Version 2.
     * // Returns [
     * //   { type: "literal", value: "in " },
     * //   { type: "integer", value: "100", unit: "day" },
     * //   { type: "literal", value: " days" }
     * // ]
     * rtf.formatToParts(100, "day")
     */

  }, {
    key: "formatToParts",
    value: function formatToParts(value, unit) {
      var rule = this.getRule(value, unit);
      var valueIndex = rule.indexOf("{0}"); // "yesterday"/"today"/"tomorrow".

      if (valueIndex < 0) {
        return [{
          type: "literal",
          value: rule
        }];
      }

      var parts = [];

      if (valueIndex > 0) {
        parts.push({
          type: "literal",
          value: rule.slice(0, valueIndex)
        });
      }

      parts.push({
        unit: unit,
        type: "integer",
        value: this.formatNumber(Math.abs(value))
      });

      if (valueIndex + "{0}".length < rule.length - 1) {
        parts.push({
          type: "literal",
          value: rule.slice(valueIndex + "{0}".length)
        });
      }

      return parts;
    }
    /**
     * Returns formatting rule for `value` in `units` (either in past or in future).
     * @param {number} value - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @return {string}
     * @throws {RangeError} If unit is not one of "second", "minute", "hour", "day", "week", "month", "quarter".
     * @example
     * // Returns "{0} days ago"
     * getRule(-2, "day")
     */

  }, {
    key: "getRule",
    value: function getRule(value, unit) {
      if (UNITS.indexOf(unit) < 0) {
        throw new RangeError("Unknown time unit: ".concat(unit, "."));
      } // Get locale-specific time interval formatting rules
      // of a given `style` for the given value of measurement `unit`.
      //
      // E.g.:
      //
      // ```json
      // {
      //  "past": {
      //    "one": "a second ago",
      //    "other": "{0} seconds ago"
      //  },
      //  "future": {
      //    "one": "in a second",
      //    "other": "in {0} seconds"
      //  }
      // }
      // ```
      //


      var unitRules = (0, _LocaleDataStore.getLocaleData)(this.locale)[this.style][unit]; // Special case for "yesterday"/"today"/"tomorrow".

      if (this.numeric === "auto") {
        // "yesterday", "the day before yesterday", etc.
        if (value === -2 || value === -1) {
          var message = unitRules["previous".concat(value === -1 ? '' : '-' + Math.abs(value))];

          if (message) {
            return message;
          }
        } // "tomorrow", "the day after tomorrow", etc.
        else if (value === 1 || value === 2) {
            var _message = unitRules["next".concat(value === 1 ? '' : '-' + Math.abs(value))];

            if (_message) {
              return _message;
            }
          } // "today"
          else if (value === 0) {
              if (unitRules.current) {
                return unitRules.current;
              }
            }
      } // Choose either "past" or "future" based on time `value` sign.
      // If there's only "other" then it's being collapsed.
      // (the resulting bundle size optimization technique)


      var quantifierRules = unitRules[value <= 0 ? "past" : "future"]; // Bundle size optimization technique.

      if (typeof quantifierRules === "string") {
        return quantifierRules;
      } // Quantify `value`.


      var quantify = (0, _LocaleDataStore.getLocaleData)(this.locale).quantify;
      var quantifier = quantify && quantify(Math.abs(value)); // There seems to be no such locale in CLDR
      // for which `quantify` is missing
      // and still `past` and `future` messages
      // contain something other than "other".

      /* istanbul ignore next */

      quantifier = quantifier || 'other'; // "other" rule is supposed to be always present.
      // If only "other" rule is present then "rules" is not an object and is a string.

      return quantifierRules[quantifier] || quantifierRules.other;
    }
    /**
     * Formats a number into a string.
     * Uses `Intl.NumberFormat` when available.
     * @param  {number} number
     * @return {string}
     */

  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      return this.numberFormat ? this.numberFormat.format(number) : String(number);
    }
    /**
     * Returns a new object with properties reflecting the locale and date and time formatting options computed during initialization of this DateTimeFormat object.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions
     * @return {Object}
     */

  }, {
    key: "resolvedOptions",
    value: function resolvedOptions() {
      return {
        locale: this.locale,
        style: this.style,
        numeric: this.numeric
      };
    }
  }]);

  return RelativeTimeFormat;
}();
/**
 * Returns an array containing those of the provided locales
 * that are supported in collation without having to fall back
 * to the runtime's default locale.
 * @param {(string|string[])} locale - A string with a BCP 47 language tag, or an array of such strings. For the general form of the locales argument, see the Intl page.
 * @param {Object} [options] - An object that may have the following property:
 * @param {string} [options.localeMatcher="lookup"] - The locale matching algorithm to use. Possible values are "lookup" and "best fit". Currently only "lookup" is supported.
 * @return {string[]} An array of strings representing a subset of the given locale tags that are supported in collation without having to fall back to the runtime's default locale.
 * @example
 * var locales = ['ban', 'id-u-co-pinyin', 'es-PY']
 * var options = { localeMatcher: 'lookup' }
 * // Returns ["id", "es-PY"]
 * Intl.RelativeTimeFormat.supportedLocalesOf(locales, options)
 */


exports.default = RelativeTimeFormat;

RelativeTimeFormat.supportedLocalesOf = function (locales) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}; // Convert `locales` to an array.

  if (typeof locales === 'string') {
    locales = [locales];
  }

  return locales.filter(function (locale) {
    return (0, _resolveLocale.default)(locale, options);
  });
};
/**
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 */


RelativeTimeFormat.addLocale = _LocaleDataStore.addLocaleData;
/**
 * Sets default locale.
 * @param  {string} locale
 */

RelativeTimeFormat.setDefaultLocale = _LocaleDataStore.setDefaultLocale;
/**
 * Gets default locale.
 * @return  {string} locale
 */

RelativeTimeFormat.getDefaultLocale = _LocaleDataStore.getDefaultLocale;
/**
 * Extracts language from an IETF BCP 47 language tag.
 * @param {string} languageTag - IETF BCP 47 language tag.
 * @return {string}
 * @example
 * // Returns "he"
 * getLanguageFromLanguageTag("he-IL-u-ca-hebrew-tz-jeruslm")
 * // Returns "ar"
 * getLanguageFromLanguageTag("ar-u-nu-latn")
 */
// export function getLanguageFromLanguageTag(languageTag) {
//   const hyphenIndex = languageTag.indexOf('-')
//   if (hyphenIndex > 0) {
//     return languageTag.slice(0, hyphenIndex)
//   }
//   return languageTag
// }
},{"./LocaleDataStore":"node_modules/relative-time-format/modules/LocaleDataStore.js","./resolveLocale":"node_modules/relative-time-format/modules/resolveLocale.js"}],"node_modules/relative-time-format/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _RelativeTimeFormat.default;
  }
});

var _RelativeTimeFormat = _interopRequireDefault(require("./modules/RelativeTimeFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./modules/RelativeTimeFormat":"node_modules/relative-time-format/modules/RelativeTimeFormat.js"}],"node_modules/javascript-time-ago/modules/cache.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * A basic in-memory cache.
 *
 * import Cache from 'javascript-time-ago/Cache'
 * const cache = new Cache()
 * const object = cache.get('key1', 'key2', ...) || cache.put('key1', 'key2', ..., createObject())
 */


var Cache =
/*#__PURE__*/
function () {
  function Cache() {
    _classCallCheck(this, Cache);

    _defineProperty(this, "cache", {});
  }

  _createClass(Cache, [{
    key: "get",
    value: function get() {
      var cache = this.cache;

      for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      for (var _i = 0; _i < keys.length; _i++) {
        var key = keys[_i];

        if (_typeof(cache) !== 'object') {
          return;
        }

        cache = cache[key];
      }

      return cache;
    }
  }, {
    key: "put",
    value: function put() {
      for (var _len2 = arguments.length, keys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        keys[_key2] = arguments[_key2];
      }

      var value = keys.pop();
      var lastKey = keys.pop();
      var cache = this.cache;

      for (var _i2 = 0; _i2 < keys.length; _i2++) {
        var key = keys[_i2];

        if (_typeof(cache[key]) !== 'object') {
          cache[key] = {};
        }

        cache = cache[key];
      }

      return cache[lastKey] = value;
    }
  }]);

  return Cache;
}();

exports.default = Cache;
},{}],"node_modules/javascript-time-ago/modules/gradation/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStep = getStep;
exports.getDate = getDate;
exports.year = exports.month = exports.day = exports.hour = exports.minute = void 0;
var minute = 60; // in seconds

exports.minute = minute;
var hour = 60 * minute; // in seconds

exports.hour = hour;
var day = 24 * hour; // in seconds
// https://www.quora.com/What-is-the-average-number-of-days-in-a-month

exports.day = day;
var month = 30.44 * day; // in seconds
// "400 years have 146097 days (taking into account leap year rules)"

exports.month = month;
var year = 146097 / 400 * day; // in seconds

/**
 * Returns a step of gradation corresponding to the unit.
 * @param  {Object[]} gradation
 * @param  {string} unit
 * @return {?Object}
 */

exports.year = year;

function getStep(gradation, unit) {
  for (var _iterator = gradation, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var step = _ref;

    if (step.unit === unit) {
      return step;
    }
  }
}
/**
 * Converts value to a `Date`
 * @param {(number|Date)} value
 * @return {Date}
 */


function getDate(value) {
  return value instanceof Date ? value : new Date(value);
}
},{}],"node_modules/javascript-time-ago/modules/gradation/canonical.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("./helpers");

// just now
// 1 second ago
// 2 seconds ago
// …
// 59 seconds ago
// 1 minute ago
// 2 minutes ago
// …
// 59 minutes ago
// 1 hour ago
// 2 hours ago
// …
// 24 hours ago
// 1 day ago
// 2 days ago
// …
// 7 days ago
// 1 week ago
// 2 weeks ago
// …
// 3 weeks ago
// 1 month ago
// 2 months ago
// …
// 11 months ago
// 1 year ago
// 2 years ago
// …
var _default = [{
  factor: 1,
  unit: 'now'
}, {
  threshold: 0.5,
  factor: 1,
  unit: 'second'
}, {
  threshold: 59.5,
  factor: 60,
  unit: 'minute'
}, {
  threshold: 59.5 * 60,
  factor: 60 * 60,
  unit: 'hour'
}, {
  threshold: 23.5 * 60 * 60,
  factor: _helpers.day,
  unit: 'day'
}, {
  threshold: 6.5 * _helpers.day,
  factor: 7 * _helpers.day,
  unit: 'week'
}, {
  threshold: 3.5 * 7 * _helpers.day,
  factor: _helpers.month,
  unit: 'month'
}, {
  threshold: 11.5 * _helpers.month,
  factor: _helpers.year,
  unit: 'year'
}];
exports.default = _default;
},{"./helpers":"node_modules/javascript-time-ago/modules/gradation/helpers.js"}],"node_modules/javascript-time-ago/modules/gradation/convenient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("./helpers");

// just now
// 1 minute ago
// 2 minutes ago
// 5 minutes ago
// 10 minutes ago
// 15 minutes ago
// 20 minutes ago
// an hour ago
// 2 hours ago
// …
// 20 hours ago
// a day ago
// 2 days ago
// 5 days ago
// a week ago
// 2 weeks ago
// 3 weeks ago
// a month ago
// 2 months ago
// 4 months ago
// a year ago
// 2 years ago
// …
var _default = [{
  factor: 1,
  unit: 'now'
}, {
  threshold: 1,
  threshold_for_now: 45,
  factor: 1,
  unit: 'second'
}, {
  threshold: 45,
  factor: 60,
  unit: 'minute'
}, {
  threshold: 2.5 * 60,
  factor: 60,
  granularity: 5,
  unit: 'minute'
}, {
  threshold: 22.5 * 60,
  factor: 30 * 60,
  unit: 'half-hour'
}, {
  threshold: 42.5 * 60,
  threshold_for_minute: 52.5 * 60,
  factor: 60 * 60,
  unit: 'hour'
}, {
  threshold: 20.5 / 24 * _helpers.day,
  factor: _helpers.day,
  unit: 'day'
}, {
  threshold: 5.5 * _helpers.day,
  factor: 7 * _helpers.day,
  unit: 'week'
}, {
  threshold: 3.5 * 7 * _helpers.day,
  factor: _helpers.month,
  unit: 'month'
}, {
  threshold: 10.5 * _helpers.month,
  factor: _helpers.year,
  unit: 'year'
}];
exports.default = _default;
},{"./helpers":"node_modules/javascript-time-ago/modules/gradation/helpers.js"}],"node_modules/javascript-time-ago/modules/gradation/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "canonical", {
  enumerable: true,
  get: function () {
    return _canonical.default;
  }
});
Object.defineProperty(exports, "convenient", {
  enumerable: true,
  get: function () {
    return _convenient.default;
  }
});
Object.defineProperty(exports, "minute", {
  enumerable: true,
  get: function () {
    return _helpers.minute;
  }
});
Object.defineProperty(exports, "hour", {
  enumerable: true,
  get: function () {
    return _helpers.hour;
  }
});
Object.defineProperty(exports, "day", {
  enumerable: true,
  get: function () {
    return _helpers.day;
  }
});
Object.defineProperty(exports, "month", {
  enumerable: true,
  get: function () {
    return _helpers.month;
  }
});
Object.defineProperty(exports, "year", {
  enumerable: true,
  get: function () {
    return _helpers.year;
  }
});
Object.defineProperty(exports, "getStep", {
  enumerable: true,
  get: function () {
    return _helpers.getStep;
  }
});
Object.defineProperty(exports, "getDate", {
  enumerable: true,
  get: function () {
    return _helpers.getDate;
  }
});

var _canonical = _interopRequireDefault(require("./canonical"));

var _convenient = _interopRequireDefault(require("./convenient"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./canonical":"node_modules/javascript-time-ago/modules/gradation/canonical.js","./convenient":"node_modules/javascript-time-ago/modules/gradation/convenient.js","./helpers":"node_modules/javascript-time-ago/modules/gradation/helpers.js"}],"node_modules/javascript-time-ago/modules/grade.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = grade;

var _gradation = require("./gradation");

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/**
 * Takes seconds `elapsed` and measures them against
 * `gradation` to return the suitable `gradation` step.
 *
 * @param {number} elapsed - Time interval (in seconds)
 *
 * @param {string[]} units - A list of allowed time units
 *                           (e.g. ['second', 'minute', 'hour', …])
 *
 * @param {Object} [gradation] - Time scale gradation steps.
 *
 *                               E.g.:
 *                               [
 *                                 { unit: 'second', factor: 1 },
 *                                 { unit: 'minute', factor: 60, threshold: 60 },
 *                                 { format(), threshold: 24 * 60 * 60 },
 *                                 …
 *                               ]
 *
 * @return {?Object} `gradation` step.
 */
function grade(elapsed, now, units) {
  var gradation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _gradation.convenient; // Leave only allowed time measurement units.
  // E.g. omit "quarter" unit.

  gradation = getAllowedSteps(gradation, units); // If no steps of gradation fit the conditions
  // then return nothing.

  if (gradation.length === 0) {
    return;
  } // Find the most appropriate gradation step


  var i = findGradationStep(elapsed, now, gradation);
  var step = gradation[i]; // If time elapsed is too small and even
  // the first gradation step doesn't suit it
  // then return nothing.

  if (i === -1) {
    return;
  } // Apply granularity to the time amount
  // (and fall back to the previous step
  //  if the first level of granularity
  //  isn't met by this amount)


  if (step.granularity) {
    // Recalculate the elapsed time amount based on granularity
    var amount = Math.round(elapsed / step.factor / step.granularity) * step.granularity; // If the granularity for this step
    // is too high, then fallback
    // to the previous step of gradation.
    // (if there is any previous step of gradation)

    if (amount === 0 && i > 0) {
      return gradation[i - 1];
    }
  }

  return step;
}
/**
 * Gets threshold for moving from `fromStep` to `next_step`.
 * @param  {Object} fromStep - From step.
 * @param  {Object} next_step - To step.
 * @param  {number} now - The current timestamp.
 * @return {number}
 * @throws Will throw if no threshold is found.
 */


function getThreshold(fromStep, toStep, now) {
  var threshold; // Allows custom thresholds when moving
  // from a specific step to a specific step.

  if (fromStep && (fromStep.id || fromStep.unit)) {
    threshold = toStep["threshold_for_".concat(fromStep.id || fromStep.unit)];
  } // If no custom threshold is set for this transition
  // then use the usual threshold for the next step.


  if (threshold === undefined) {
    threshold = toStep.threshold;
  } // Convert threshold to a number.


  if (typeof threshold === 'function') {
    threshold = threshold(now);
  } // Throw if no threshold is found.


  if (fromStep && typeof threshold !== 'number') {
    // Babel transforms `typeof` into some "branches"
    // so istanbul will show this as "branch not covered".

    /* istanbul ignore next */
    var type = _typeof(threshold);

    throw new Error("Each step of a gradation must have a threshold defined except for the first one. Got \"".concat(threshold, "\", ").concat(type, ". Step: ").concat(JSON.stringify(toStep)));
  }

  return threshold;
}
/**
 * @param  {number} elapsed - Time elapsed (in seconds).
 * @param  {number} now - Current timestamp.
 * @param  {Object} gradation - Gradation.
 * @param  {number} i - Gradation step currently being tested.
 * @return {number} Gradation step index.
 */


function findGradationStep(elapsed, now, gradation) {
  var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0; // If the threshold for moving from previous step
  // to this step is too high then return the previous step.

  if (elapsed < getThreshold(gradation[i - 1], gradation[i], now)) {
    return i - 1;
  } // If it's the last step of gradation then return it.


  if (i === gradation.length - 1) {
    return i;
  } // Move to the next step.


  return findGradationStep(elapsed, now, gradation, i + 1);
}
/**
 * Leaves only allowed gradation steps.
 * @param  {Object[]} gradation
 * @param  {string[]} units - Allowed time units.
 * @return {Object[]}
 */


function getAllowedSteps(gradation, units) {
  return gradation.filter(function (_ref) {
    var unit = _ref.unit; // If this step has a `unit` defined
    // then this `unit` must be in the list of `units` allowed.

    if (unit) {
      return units.indexOf(unit) >= 0;
    } // A gradation step is not required to specify a `unit`.
    // E.g. for Twitter gradation it specifies `format()` instead.


    return true;
  });
}
},{"./gradation":"node_modules/javascript-time-ago/modules/gradation/index.js"}],"node_modules/javascript-time-ago/modules/locale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chooseLocale;
exports.intlDateTimeFormatSupportedLocale = intlDateTimeFormatSupportedLocale;
exports.intlDateTimeFormatSupported = intlDateTimeFormatSupported;

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
} // Chooses the most appropriate locale
// (one of the registered ones)
// based on the list of preferred `locales` supplied by the user.
//
// @param {string[]} locales - the list of preferable locales (in [IETF format](https://en.wikipedia.org/wiki/IETF_language_tag)).
// @param {Function} isLocaleDataAvailable - tests if a locale is available.
//
// @returns {string} The most suitable locale
//
// @example
// // Returns 'en'
// chooseLocale(['en-US'], undefined, (locale) => locale === 'ru' || locale === 'en')
//


function chooseLocale(locales, isLocaleDataAvailable) {
  // This is not an intelligent algorythm,
  // but it will do for this library's case.
  // `sr-Cyrl-BA` -> `sr-Cyrl` -> `sr`.
  for (var _iterator = locales, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var locale = _ref;

    if (isLocaleDataAvailable(locale)) {
      return locale;
    }

    var parts = locale.split('-');

    while (parts.length > 1) {
      parts.pop();
      locale = parts.join('-');

      if (isLocaleDataAvailable(locale)) {
        return locale;
      }
    }
  }

  throw new Error("No locale data has been registered for any of the locales: ".concat(locales.join(', ')));
}
/**
 * Whether can use `Intl.DateTimeFormat` for these `locales`.
 * Returns the first suitable one.
 * @param  {(string|string[])} locales
 * @return {?string} The first locale that can be used.
 */


function intlDateTimeFormatSupportedLocale(locales) {
  /* istanbul ignore else */
  if (intlDateTimeFormatSupported()) {
    return Intl.DateTimeFormat.supportedLocalesOf(locales)[0];
  }
}
/**
 * Whether can use `Intl.DateTimeFormat`.
 * @return {boolean}
 */


function intlDateTimeFormatSupported() {
  // Babel transforms `typeof` into some "branches"
  // so istanbul will show this as "branch not covered".

  /* istanbul ignore next */
  var isIntlAvailable = (typeof Intl === "undefined" ? "undefined" : _typeof(Intl)) === 'object';
  return isIntlAvailable && typeof Intl.DateTimeFormat === 'function';
}
},{}],"node_modules/javascript-time-ago/modules/style/time.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gradation = require("../gradation");

// Similar to the default style but with "ago" omitted.
//
// just now
// 5 minutes
// 10 minutes
// 15 minutes
// 20 minutes
// an hour
// 2 hours
// …
// 20 hours
// 1 day
// 2 days
// a week
// 2 weeks
// 3 weeks
// a month
// 2 months
// 3 months
// 4 months
// a year
// 2 years
//
var _default = {
  gradation: _gradation.convenient,
  flavour: 'long-time',
  units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year']
};
exports.default = _default;
},{"../gradation":"node_modules/javascript-time-ago/modules/gradation/index.js"}],"node_modules/javascript-time-ago/modules/style/twitter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gradation = require("../gradation");

var _locale = require("../locale");

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

// A cache for `Intl.DateTimeFormat` twitter formatters
// for various locales (is a global variable).
var formatters = {}; // Twitter style relative time formatting.
// ("1m", "2h", "Mar 3", "Apr 4, 2012").
// Seconds, minutes and hours are shown relatively,
// and other intervals can be shown using full date format.

var _default = {
  // Twitter gradation is derived from "canonical" gradation
  // adjusting its "minute" `threshold` to be 45.
  gradation: [// Minutes
  _objectSpread({}, (0, _gradation.getStep)(_gradation.canonical, 'minute'), {
    threshold: 45
  }), // Hours
  (0, _gradation.getStep)(_gradation.canonical, 'hour'), // If `date` and `now` happened the same year,
  // then only output month and day.
  {
    threshold: _gradation.day - 0.5 * _gradation.hour,
    format: function format(value, locale) {
      // Whether can use `Intl.DateTimeFormat`.
      // If `Intl` is not available,
      // or the locale is not supported,
      // then don't override the default labels.

      /* istanbul ignore if */
      if (!(0, _locale.intlDateTimeFormatSupported)()) {
        return;
      }
      /* istanbul ignore else */


      if (!formatters[locale]) {
        formatters[locale] = {};
      }
      /* istanbul ignore else */


      if (!formatters[locale].this_year) {
        // "Apr 11" (MMMd)
        formatters[locale].this_year = new Intl.DateTimeFormat(locale, {
          month: 'short',
          day: 'numeric'
        });
      } // Output month and day.


      return formatters[locale].this_year.format((0, _gradation.getDate)(value));
    }
  }, // If `date` and `now` happened in defferent years,
  // then output day, month and year.
  {
    threshold: function threshold(now) {
      // Jan 1st of the next year.
      var nextYear = new Date(new Date(now).getFullYear() + 1, 0);
      return (nextYear.getTime() - now) / 1000;
    },
    format: function format(value, locale) {
      // Whether can use `Intl.DateTimeFormat`.
      // If `Intl` is not available,
      // or the locale is not supported,
      // then don't override the default labels.

      /* istanbul ignore if */
      if (!(0, _locale.intlDateTimeFormatSupported)()) {
        return;
      }
      /* istanbul ignore if */


      if (!formatters[locale]) {
        formatters[locale] = {};
      }
      /* istanbul ignore else */


      if (!formatters[locale].other) {
        // "Apr 11, 2017" (yMMMd)
        formatters[locale].other = new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } // Output day, month and year.


      return formatters[locale].other.format((0, _gradation.getDate)(value));
    }
  }],
  flavour: ['tiny', 'short-time', 'narrow', 'short']
};
exports.default = _default;
},{"../gradation":"node_modules/javascript-time-ago/modules/gradation/index.js","../locale":"node_modules/javascript-time-ago/modules/locale.js"}],"node_modules/javascript-time-ago/modules/style/default.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gradation = require("../gradation");

var _default = {
  gradation: _gradation.convenient,
  flavour: ['long-convenient', 'long'],
  units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year']
};
exports.default = _default;
},{"../gradation":"node_modules/javascript-time-ago/modules/gradation/index.js"}],"node_modules/javascript-time-ago/modules/style/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeStyle", {
  enumerable: true,
  get: function () {
    return _time.default;
  }
});
Object.defineProperty(exports, "twitterStyle", {
  enumerable: true,
  get: function () {
    return _twitter.default;
  }
});
Object.defineProperty(exports, "defaultStyle", {
  enumerable: true,
  get: function () {
    return _default.default;
  }
});

var _time = _interopRequireDefault(require("./time"));

var _twitter = _interopRequireDefault(require("./twitter"));

var _default = _interopRequireDefault(require("./default"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./time":"node_modules/javascript-time-ago/modules/style/time.js","./twitter":"node_modules/javascript-time-ago/modules/style/twitter.js","./default":"node_modules/javascript-time-ago/modules/style/default.js"}],"node_modules/javascript-time-ago/modules/LocaleDataStore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocaleData = getLocaleData;
exports.addLocaleData = addLocaleData;
// Fallback locale.
// (when not a single one of the supplied "preferred" locales is available)
var defaultLocale = 'en'; // For all locales added
// their relative time formatter messages will be stored here.

var localesData = {};

function getLocaleData(locale) {
  return localesData[locale];
}

function addLocaleData(localeData) {
  if (!localeData) {
    throw new Error('[javascript-time-ago] No locale data passed.');
  } // This locale data is stored in a global variable
  // and later used when calling `.format(time)`.


  localesData[localeData.locale] = localeData;
}
},{}],"node_modules/javascript-time-ago/modules/JavascriptTimeAgo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _relativeTimeFormat = _interopRequireDefault(require("relative-time-format"));

var _cache = _interopRequireDefault(require("./cache"));

var _grade = _interopRequireDefault(require("./grade"));

var _locale = _interopRequireDefault(require("./locale"));

var _style = require("./style");

var _LocaleDataStore = require("./LocaleDataStore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// const EXTRA_STYLES = [
// 	'long-convenient',
// 	'long-time',
// 	'short-convenient',
// 	'short-time',
// 	'tiny'
// ]
// Valid time units.
var UNITS = ['now', // The rest are the same as in `Intl.RelativeTimeFormat`.
'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];

var JavascriptTimeAgo =
/*#__PURE__*/
function () {
  /**
   * @param {(string|string[])} locales=[] - Preferred locales (or locale).
   */
  function JavascriptTimeAgo() {
    var locales = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, JavascriptTimeAgo); // Convert `locales` to an array.


    if (typeof locales === 'string') {
      locales = [locales];
    } // Choose the most appropriate locale
    // (one of the previously added ones)
    // based on the list of preferred `locales` supplied by the user.


    this.locale = (0, _locale.default)(locales.concat(_relativeTimeFormat.default.getDefaultLocale()), _LocaleDataStore.getLocaleData); // Use `Intl.NumberFormat` for formatting numbers (when available).

    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      this.numberFormat = new Intl.NumberFormat(this.locale);
    } // Cache `Intl.RelativeTimeFormat` instance.


    this.relativeTimeFormatCache = new _cache.default();
  } // Formats the relative date/time.
  //
  // @return {string} Returns the formatted relative date/time.
  //
  // @param {(Object|string)} [style] - Relative date/time formatting style.
  //
  // @param {string[]} [style.units] - A list of allowed time units
  //                                  (e.g. ['second', 'minute', 'hour', …])
  //
  // @param {Function} [style.custom] - `function ({ elapsed, time, date, now })`.
  //                                    If this function returns a value, then
  //                                    the `.format()` call will return that value.
  //                                    Otherwise it has no effect.
  //
  // @param {string} [style.flavour] - e.g. "long", "short", "tiny", etc.
  //
  // @param {Object[]} [style.gradation] - Time scale gradation steps.
  //
  // @param {string} style.gradation[].unit - Time interval measurement unit.
  //                                          (e.g. ['second', 'minute', 'hour', …])
  //
  // @param {Number} style.gradation[].factor - Time interval measurement unit factor.
  //                                            (e.g. `60` for 'minute')
  //
  // @param {Number} [style.gradation[].granularity] - A step for the unit's "amount" value.
  //                                                   (e.g. `5` for '0 minutes', '5 minutes', etc)
  //
  // @param {Number} [style.gradation[].threshold] - Time interval measurement unit threshold.
  //                                                 (e.g. `45` seconds for 'minute').
  //                                                 There can also be specific `threshold_[unit]`
  //                                                 thresholds for fine-tuning.
  //


  _createClass(JavascriptTimeAgo, [{
    key: "format",
    value: function format(input) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _style.defaultStyle;

      if (typeof style === 'string') {
        switch (style) {
          case 'twitter':
            style = _style.twitterStyle;
            break;

          case 'time':
            style = _style.timeStyle;
            break;

          default:
            style = _style.defaultStyle;
        }
      }

      var _getDateAndTimeBeingF = getDateAndTimeBeingFormatted(input),
          date = _getDateAndTimeBeingF.date,
          time = _getDateAndTimeBeingF.time; // Get locale messages for this formatting flavour


      var _this$getLocaleData = this.getLocaleData(style.flavour),
          flavour = _this$getLocaleData.flavour,
          localeData = _this$getLocaleData.localeData; // Can pass a custom `now`, e.g. for testing purposes.
      // Technically it doesn't belong to `style`
      // but since this is an undocumented internal feature,
      // taking it from the `style` argument will do (for now).


      var now = style.now || Date.now(); // how much time elapsed (in seconds)

      var elapsed = (now - time) / 1000; // in seconds
      // `custom` – A function of `{ elapsed, time, date, now, locale }`.
      // If this function returns a value, then the `.format()` call will return that value.
      // Otherwise the relative date/time is formatted as usual.
      // This feature is currently not used anywhere and is here
      // just for providing the ultimate customization point
      // in case anyone would ever need that. Prefer using
      // `gradation[step].format(value, locale)` instead.
      //
      // I guess `custom` is deprecated and will be removed
      // in some future major version release.
      //

      if (style.custom) {
        var custom = style.custom({
          now: now,
          date: date,
          time: time,
          elapsed: elapsed,
          locale: this.locale
        });

        if (custom !== undefined) {
          return custom;
        }
      } // Available time interval measurement units.


      var units = getTimeIntervalMeasurementUnits(localeData, style.units); // If no available time unit is suitable, just output an empty string.

      if (units.length === 0) {
        console.error("Units \"".concat(units.join(', '), "\" were not found in locale data for \"").concat(this.locale, "\"."));
        return '';
      } // Choose the appropriate time measurement unit
      // and get the corresponding rounded time amount.


      var step = (0, _grade.default)(Math.abs(elapsed), now, units, style.gradation); // If no time unit is suitable, just output an empty string.
      // E.g. when "now" unit is not available
      // and "second" has a threshold of `0.5`
      // (e.g. the "canonical" grading scale).

      if (!step) {
        return '';
      }

      if (step.format) {
        return step.format(date || time, this.locale);
      }

      var unit = step.unit,
          factor = step.factor,
          granularity = step.granularity;
      var amount = Math.abs(elapsed) / factor; // Apply granularity to the time amount
      // (and fallback to the previous step
      //  if the first level of granularity
      //  isn't met by this amount)

      if (granularity) {
        // Recalculate the elapsed time amount based on granularity
        amount = Math.round(amount / granularity) * granularity;
      } // `Intl.RelativeTimeFormat` doesn't operate in "now" units.


      if (unit === 'now') {
        return getNowMessage(localeData, -1 * Math.sign(elapsed));
      }

      switch (flavour) {
        case 'long':
        case 'short':
        case 'narrow':
          // Format `value` using `Intl.RelativeTimeFormat`.
          return this.getFormatter(flavour).format(-1 * Math.sign(elapsed) * Math.round(amount), unit);

        default:
          // Format `value`.
          // (mimicks `Intl.RelativeTimeFormat` with the addition of extra styles)
          return this.formatValue(-1 * Math.sign(elapsed) * Math.round(amount), unit, localeData);
      }
    }
    /**
     * Mimicks what `Intl.RelativeTimeFormat` does for additional locale styles.
     * @param  {number} value
     * @param  {string} unit
     * @param  {object} localeData — Relative time messages for the flavor.
     * @return {string}
     */

  }, {
    key: "formatValue",
    value: function formatValue(value, unit, localeData) {
      return this.getRule(value, unit, localeData).replace('{0}', this.formatNumber(Math.abs(value)));
    }
    /**
     * Returns formatting rule for `value` in `units` (either in past or in future).
     * @param {number} value - Time interval value.
     * @param {string} unit - Time interval measurement unit.
     * @param  {object} localeData — Relative time messages for the flavor.
     * @return {string}
     * @example
     * // Returns "{0} days ago"
     * getRule(-2, "day")
     */

  }, {
    key: "getRule",
    value: function getRule(value, unit, localeData) {
      var unitRules = localeData[unit]; // Bundle size optimization technique.

      if (typeof unitRules === 'string') {
        return unitRules;
      } // Choose either "past" or "future" based on time `value` sign.
      // If "past" is same as "future" then they're stored as "other".
      // If there's only "other" then it's being collapsed.


      var quantifierRules = unitRules[value <= 0 ? 'past' : 'future'] || unitRules; // Bundle size optimization technique.

      if (typeof quantifierRules === 'string') {
        return quantifierRules;
      } // Quantify `value`.


      var quantify = (0, _LocaleDataStore.getLocaleData)(this.locale).quantify;
      var quantifier = quantify && quantify(Math.abs(value)); // There seems to be no such locale in CLDR
      // for which `quantify` is missing
      // and still `past` and `future` messages
      // contain something other than "other".

      /* istanbul ignore next */

      quantifier = quantifier || 'other'; // "other" rule is supposed to always be present.
      // If only "other" rule is present then "rules" is not an object and is a string.

      return quantifierRules[quantifier] || quantifierRules.other;
    }
    /**
     * Formats a number into a string.
     * Uses `Intl.NumberFormat` when available.
     * @param  {number} number
     * @return {string}
     */

  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      return this.numberFormat ? this.numberFormat.format(number) : String(number);
    }
    /**
     * Returns an `Intl.RelativeTimeFormat` for a given `flavor`.
     * @param {string} flavor
     * @return {object} `Intl.RelativeTimeFormat` instance
     */

  }, {
    key: "getFormatter",
    value: function getFormatter(flavor) {
      // `Intl.RelativeTimeFormat` instance creation is assumed a
      // lengthy operation so the instances are cached and reused.
      return this.relativeTimeFormatCache.get(this.locale, flavor) || this.relativeTimeFormatCache.put(this.locale, flavor, new _relativeTimeFormat.default(this.locale, {
        style: flavor
      }));
    }
    /**
     * Gets locale messages for this formatting flavour
     *
     * @param {(string|string[])} flavour - Relative date/time formatting flavour.
     *                                      If it's an array then all flavours are tried in order.
     *
     * @returns {Object} Returns an object of shape { flavour, localeData }
     */

  }, {
    key: "getLocaleData",
    value: function getLocaleData() {
      var flavour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []; // Get relative time formatting rules for this locale

      var localeData = (0, _LocaleDataStore.getLocaleData)(this.locale); // Convert `flavour` to an array.

      if (typeof flavour === 'string') {
        flavour = [flavour];
      } // "long" flavour is the default one.
      // (it's always present)


      flavour = flavour.concat('long'); // Find a suitable flavour.

      for (var _iterator = flavour, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _ = _ref;

        if (localeData[_]) {
          return {
            flavour: _,
            localeData: localeData[_]
          };
        }
      } // Can't happen - "long" flavour is always present.
      // throw new Error(`None of the flavours - ${flavour.join(', ')} - was found for locale "${this.locale}".`)

    }
  }]);

  return JavascriptTimeAgo;
}();
/**
 * Gets default locale.
 * @return  {string} locale
 */


exports.default = JavascriptTimeAgo;
JavascriptTimeAgo.getDefaultLocale = _relativeTimeFormat.default.getDefaultLocale;
/**
 * Sets default locale.
 * @param  {string} locale
 */

JavascriptTimeAgo.setDefaultLocale = _relativeTimeFormat.default.setDefaultLocale;
/**
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 */

JavascriptTimeAgo.addLocale = function (localeData) {
  (0, _LocaleDataStore.addLocaleData)(localeData);

  _relativeTimeFormat.default.addLocale(localeData);
};
/**
 * (legacy alias)
 * Adds locale data for a specific locale.
 * @param {Object} localeData
 * @deprecated
 */


JavascriptTimeAgo.locale = JavascriptTimeAgo.addLocale; // Normalizes `.format()` `time` argument.

function getDateAndTimeBeingFormatted(input) {
  if (input.constructor === Date) {
    return {
      date: input,
      time: input.getTime()
    };
  }

  if (typeof input === 'number') {
    return {
      time: input // `date` is not required for formatting
      // relative times unless "twitter" preset is used.
      // date : new Date(input)

    };
  } // For some weird reason istanbul doesn't see this `throw` covered.

  /* istanbul ignore next */


  throw new Error("Unsupported relative time formatter input: ".concat(_typeof(input), ", ").concat(input));
} // Get available time interval measurement units.


function getTimeIntervalMeasurementUnits(localeData, restrictedSetOfUnits) {
  // All available time interval measurement units.
  var units = Object.keys(localeData); // If only a specific set of available
  // time measurement units can be used.

  if (restrictedSetOfUnits) {
    // Reduce available time interval measurement units
    // based on user's preferences.
    units = restrictedSetOfUnits.filter(function (_) {
      return units.indexOf(_) >= 0;
    });
  } // Stock `Intl.RelativeTimeFormat` locale data doesn't have "now" units.
  // So either "now" is present in extended locale data
  // or it's taken from ".second.current".


  if ((!restrictedSetOfUnits || restrictedSetOfUnits.indexOf('now') >= 0) && units.indexOf('now') < 0) {
    if (localeData.second.current) {
      units.unshift('now');
    }
  }

  return units;
}

function getNowMessage(localeData, value) {
  // Specific "now" message form extended locale data (if present).
  if (localeData.now) {
    // Bundle size optimization technique.
    if (typeof localeData.now === 'string') {
      return localeData.now;
    } // Not handling `value === 0` as `localeData.now.current` here
    // because it wouldn't make sense: "now" is a moment,
    // so one can't possibly differentiate between a
    // "previous" moment, a "current" moment and a "next moment".
    // It can only be differentiated between "past" and "future".


    if (value <= 0) {
      return localeData.now.past;
    } else {
      return localeData.now.future;
    }
  } // Use ".second.current" as "now" message.


  return localeData.second.current; // If this function was called then
  // it means that either "now" unit messages are
  // available or ".second.current" message is present.
}
},{"relative-time-format":"node_modules/relative-time-format/index.js","./cache":"node_modules/javascript-time-ago/modules/cache.js","./grade":"node_modules/javascript-time-ago/modules/grade.js","./locale":"node_modules/javascript-time-ago/modules/locale.js","./style":"node_modules/javascript-time-ago/modules/style/index.js","./LocaleDataStore":"node_modules/javascript-time-ago/modules/LocaleDataStore.js"}],"node_modules/javascript-time-ago/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _JavascriptTimeAgo.default;
  }
});
Object.defineProperty(exports, "intlDateTimeFormatSupported", {
  enumerable: true,
  get: function () {
    return _locale.intlDateTimeFormatSupported;
  }
});
Object.defineProperty(exports, "intlDateTimeFormatSupportedLocale", {
  enumerable: true,
  get: function () {
    return _locale.intlDateTimeFormatSupportedLocale;
  }
});

var _JavascriptTimeAgo = _interopRequireDefault(require("./modules/JavascriptTimeAgo"));

var _locale = require("./modules/locale");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./modules/JavascriptTimeAgo":"node_modules/javascript-time-ago/modules/JavascriptTimeAgo.js","./modules/locale":"node_modules/javascript-time-ago/modules/locale.js"}],"node_modules/numeral/numeral.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*! @preserve
 * numeral.js
 * version : 2.0.6
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.numeral = factory();
    }
}(this, function () {
    /************************************
        Variables
    ************************************/

    var numeral,
        _,
        VERSION = '2.0.6',
        formats = {},
        locales = {},
        defaults = {
            currentLocale: 'en',
            zeroFormat: null,
            nullFormat: null,
            defaultFormat: '0,0',
            scalePercentBy100: true
        },
        options = {
            currentLocale: defaults.currentLocale,
            zeroFormat: defaults.zeroFormat,
            nullFormat: defaults.nullFormat,
            defaultFormat: defaults.defaultFormat,
            scalePercentBy100: defaults.scalePercentBy100
        };


    /************************************
        Constructors
    ************************************/

    // Numeral prototype object
    function Numeral(input, number) {
        this._input = input;

        this._value = number;
    }

    numeral = function(input) {
        var value,
            kind,
            unformatFunction,
            regexp;

        if (numeral.isNumeral(input)) {
            value = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            value = 0;
        } else if (input === null || _.isNaN(input)) {
            value = null;
        } else if (typeof input === 'string') {
            if (options.zeroFormat && input === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                for (kind in formats) {
                    regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                    if (regexp && input.match(regexp)) {
                        unformatFunction = formats[kind].unformat;

                        break;
                    }
                }

                unformatFunction = unformatFunction || numeral._.stringToNumber;

                value = unformatFunction(input);
            }
        } else {
            value = Number(input)|| null;
        }

        return new Numeral(input, value);
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function(obj) {
        return obj instanceof Numeral;
    };

    // helper functions
    numeral._ = _ = {
        // formats numbers separators, decimals places, signs, abbreviations
        numberToFormat: function(value, format, roundingFunction) {
            var locale = locales[numeral.options.currentLocale],
                negP = false,
                optDec = false,
                leadingCount = 0,
                abbr = '',
                trillion = 1000000000000,
                billion = 1000000000,
                million = 1000000,
                thousand = 1000,
                decimal = '',
                neg = false,
                abbrForce, // force abbreviation
                abs,
                min,
                max,
                power,
                int,
                precision,
                signed,
                thousands,
                output;

            // make sure we never format a null value
            value = value || 0;

            abs = Math.abs(value);

            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (numeral._.includes(format, '(')) {
                negP = true;
                format = format.replace(/[\(|\)]/g, '');
            } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                format = format.replace(/[\+|\-]/g, '');
            }

            // see if abbreviation is wanted
            if (numeral._.includes(format, 'a')) {
                abbrForce = format.match(/a(k|m|b|t)?/);

                abbrForce = abbrForce ? abbrForce[1] : false;

                // check for space before abbreviation
                if (numeral._.includes(format, ' a')) {
                    abbr = ' ';
                }

                format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                if (abs >= trillion && !abbrForce || abbrForce === 't') {
                    // trillion
                    abbr += locale.abbreviations.trillion;
                    value = value / trillion;
                } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                    // billion
                    abbr += locale.abbreviations.billion;
                    value = value / billion;
                } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                    // million
                    abbr += locale.abbreviations.million;
                    value = value / million;
                } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                    // thousand
                    abbr += locale.abbreviations.thousand;
                    value = value / thousand;
                }
            }

            // check for optional decimals
            if (numeral._.includes(format, '[.]')) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            // break number and format
            int = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');
            leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

            if (precision) {
                if (numeral._.includes(precision, '[')) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                }

                int = decimal.split('.')[0];

                if (numeral._.includes(decimal, '.')) {
                    decimal = locale.delimiters.decimal + decimal.split('.')[1];
                } else {
                    decimal = '';
                }

                if (optDec && Number(decimal.slice(1)) === 0) {
                    decimal = '';
                }
            } else {
                int = numeral._.toFixed(value, 0, roundingFunction);
            }

            // check abbreviation again after rounding
            if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                int = String(Number(int) / 1000);

                switch (abbr) {
                    case locale.abbreviations.thousand:
                        abbr = locale.abbreviations.million;
                        break;
                    case locale.abbreviations.million:
                        abbr = locale.abbreviations.billion;
                        break;
                    case locale.abbreviations.billion:
                        abbr = locale.abbreviations.trillion;
                        break;
                }
            }


            // format number
            if (numeral._.includes(int, '-')) {
                int = int.slice(1);
                neg = true;
            }

            if (int.length < leadingCount) {
                for (var i = leadingCount - int.length; i > 0; i--) {
                    int = '0' + int;
                }
            }

            if (thousands > -1) {
                int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                int = '';
            }

            output = int + decimal + (abbr ? abbr : '');

            if (negP) {
                output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
            } else {
                if (signed >= 0) {
                    output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                } else if (neg) {
                    output = '-' + output;
                }
            }

            return output;
        },
        // unformats numbers separators, decimals places, signs, abbreviations
        stringToNumber: function(string) {
            var locale = locales[options.currentLocale],
                stringOriginal = string,
                abbreviations = {
                    thousand: 3,
                    million: 6,
                    billion: 9,
                    trillion: 12
                },
                abbreviation,
                value,
                i,
                regexp;

            if (options.zeroFormat && string === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                value = 1;

                if (locale.delimiters.decimal !== '.') {
                    string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                }

                for (abbreviation in abbreviations) {
                    regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                    if (stringOriginal.match(regexp)) {
                        value *= Math.pow(10, abbreviations[abbreviation]);
                        break;
                    }
                }

                // check for negative number
                value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                // remove non numbers
                string = string.replace(/[^0-9\.]+/g, '');

                value *= Number(string);
            }

            return value;
        },
        isNaN: function(value) {
            return typeof value === 'number' && isNaN(value);
        },
        includes: function(string, search) {
            return string.indexOf(search) !== -1;
        },
        insert: function(string, subString, start) {
            return string.slice(0, start) + subString + string.slice(start);
        },
        reduce: function(array, callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(array),
                len = t.length >>> 0,
                k = 0,
                value;

            if (arguments.length === 3) {
                value = arguments[2];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }

                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        },
        /**
         * Computes the multiplier necessary to make x >= 1,
         * effectively eliminating miscalculations caused by
         * finite precision.
         */
        multiplier: function (x) {
            var parts = x.toString().split('.');

            return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
        },
        /**
         * Given a variable number of arguments, returns the maximum
         * multiplier that must be used to normalize an operation involving
         * all of them.
         */
        correctionFactor: function () {
            var args = Array.prototype.slice.call(arguments);

            return args.reduce(function(accum, next) {
                var mn = _.multiplier(next);
                return accum > mn ? accum : mn;
            }, 1);
        },
        /**
         * Implementation of toFixed() that treats floats more like decimals
         *
         * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
         * problems for accounting- and finance-related software.
         */
        toFixed: function(value, maxDecimals, roundingFunction, optionals) {
            var splitValue = value.toString().split('.'),
                minDecimals = maxDecimals - (optionals || 0),
                boundedPrecision,
                optionalsRegExp,
                power,
                output;

            // Use the smallest precision value possible to avoid errors from floating point representation
            if (splitValue.length === 2) {
              boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
            } else {
              boundedPrecision = minDecimals;
            }

            power = Math.pow(10, boundedPrecision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

            if (optionals > maxDecimals - boundedPrecision) {
                optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                output = output.replace(optionalsRegExp, '');
            }

            return output;
        }
    };

    // avaliable options
    numeral.options = options;

    // avaliable formats
    numeral.formats = formats;

    // avaliable formats
    numeral.locales = locales;

    // This function sets the current locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    numeral.locale = function(key) {
        if (key) {
            options.currentLocale = key.toLowerCase();
        }

        return options.currentLocale;
    };

    // This function provides access to the loaded locale data.  If
    // no arguments are passed in, it will simply return the current
    // global locale object.
    numeral.localeData = function(key) {
        if (!key) {
            return locales[options.currentLocale];
        }

        key = key.toLowerCase();

        if (!locales[key]) {
            throw new Error('Unknown locale : ' + key);
        }

        return locales[key];
    };

    numeral.reset = function() {
        for (var property in defaults) {
            options[property] = defaults[property];
        }
    };

    numeral.zeroFormat = function(format) {
        options.zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.nullFormat = function (format) {
        options.nullFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function(format) {
        options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    numeral.register = function(type, name, format) {
        name = name.toLowerCase();

        if (this[type + 's'][name]) {
            throw new TypeError(name + ' ' + type + ' already registered.');
        }

        this[type + 's'][name] = format;

        return format;
    };


    numeral.validate = function(val, culture) {
        var _decimalSep,
            _thousandSep,
            _currSymbol,
            _valArray,
            _abbrObj,
            _thousandRegEx,
            localeData,
            temp;

        //coerce val to string
        if (typeof val !== 'string') {
            val += '';

            if (console.warn) {
                console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
            }
        }

        //trim whitespaces from either sides
        val = val.trim();

        //if val is just digits return true
        if (!!val.match(/^\d+$/)) {
            return true;
        }

        //if val is empty return false
        if (val === '') {
            return false;
        }

        //get the decimal and thousands separator from numeral.localeData
        try {
            //check if the culture is understood by numeral. if not, default it to current locale
            localeData = numeral.localeData(culture);
        } catch (e) {
            localeData = numeral.localeData(numeral.locale());
        }

        //setup the delimiters and currency symbol based on culture/locale
        _currSymbol = localeData.currency.symbol;
        _abbrObj = localeData.abbreviations;
        _decimalSep = localeData.delimiters.decimal;
        if (localeData.delimiters.thousands === '.') {
            _thousandSep = '\\.';
        } else {
            _thousandSep = localeData.delimiters.thousands;
        }

        // validating currency symbol
        temp = val.match(/^[^\d]+/);
        if (temp !== null) {
            val = val.substr(1);
            if (temp[0] !== _currSymbol) {
                return false;
            }
        }

        //validating abbreviation symbol
        temp = val.match(/[^\d]+$/);
        if (temp !== null) {
            val = val.slice(0, -1);
            if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                return false;
            }
        }

        _thousandRegEx = new RegExp(_thousandSep + '{2}');

        if (!val.match(/[^\d.,]/g)) {
            _valArray = val.split(_decimalSep);
            if (_valArray.length > 2) {
                return false;
            } else {
                if (_valArray.length < 2) {
                    return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                } else {
                    if (_valArray[0].length === 1) {
                        return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    } else {
                        return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    }
                }
            }
        }

        return false;
    };


    /************************************
        Numeral Prototype
    ************************************/

    numeral.fn = Numeral.prototype = {
        clone: function() {
            return numeral(this);
        },
        format: function(inputString, roundingFunction) {
            var value = this._value,
                format = inputString || options.defaultFormat,
                kind,
                output,
                formatFunction;

            // make sure we have a roundingFunction
            roundingFunction = roundingFunction || Math.round;

            // format based on value
            if (value === 0 && options.zeroFormat !== null) {
                output = options.zeroFormat;
            } else if (value === null && options.nullFormat !== null) {
                output = options.nullFormat;
            } else {
                for (kind in formats) {
                    if (format.match(formats[kind].regexps.format)) {
                        formatFunction = formats[kind].format;

                        break;
                    }
                }

                formatFunction = formatFunction || numeral._.numberToFormat;

                output = formatFunction(value, format, roundingFunction);
            }

            return output;
        },
        value: function() {
            return this._value;
        },
        input: function() {
            return this._input;
        },
        set: function(value) {
            this._value = Number(value);

            return this;
        },
        add: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum + Math.round(corrFactor * curr);
            }

            this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

            return this;
        },
        subtract: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum - Math.round(corrFactor * curr);
            }

            this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

            return this;
        },
        multiply: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback, 1);

            return this;
        },
        divide: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback);

            return this;
        },
        difference: function(value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }
    };

    /************************************
        Default Locale && Format
    ************************************/

    numeral.register('locale', 'en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function(number) {
            var b = number % 10;
            return (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    

(function() {
        numeral.register('format', 'bps', {
            regexps: {
                format: /(BPS)/,
                unformat: /(BPS)/
            },
            format: function(value, format, roundingFunction) {
                var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                    output;

                value = value * 10000;

                // check for space before BPS
                format = format.replace(/\s?BPS/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + 'BPS');

                    output = output.join('');
                } else {
                    output = output + space + 'BPS';
                }

                return output;
            },
            unformat: function(string) {
                return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
            }
        });
})();


(function() {
        var decimal = {
            base: 1000,
            suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        binary = {
            base: 1024,
            suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        };

    var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
            return decimal.suffixes.indexOf(item) < 0;
        }));
        var unformatRegex = allSuffixes.join('|');
        // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
        unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

    numeral.register('format', 'bytes', {
        regexps: {
            format: /([0\s]i?b)/,
            unformat: new RegExp(unformatRegex)
        },
        format: function(value, format, roundingFunction) {
            var output,
                bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                power,
                min,
                max;

            // check for space before
            format = format.replace(/\s?i?b/, '');

            for (power = 0; power <= bytes.suffixes.length; power++) {
                min = Math.pow(bytes.base, power);
                max = Math.pow(bytes.base, power + 1);

                if (value === null || value === 0 || value >= min && value < max) {
                    suffix += bytes.suffixes[power];

                    if (min > 0) {
                        value = value / min;
                    }

                    break;
                }
            }

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + suffix;
        },
        unformat: function(string) {
            var value = numeral._.stringToNumber(string),
                power,
                bytesMultiplier;

            if (value) {
                for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                    if (numeral._.includes(string, decimal.suffixes[power])) {
                        bytesMultiplier = Math.pow(decimal.base, power);

                        break;
                    }

                    if (numeral._.includes(string, binary.suffixes[power])) {
                        bytesMultiplier = Math.pow(binary.base, power);

                        break;
                    }
                }

                value *= (bytesMultiplier || 1);
            }

            return value;
        }
    });
})();


(function() {
        numeral.register('format', 'currency', {
        regexps: {
            format: /(\$)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                symbols = {
                    before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                    after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                },
                output,
                symbol,
                i;

            // strip format of spaces and $
            format = format.replace(/\s?\$\s?/, '');

            // format the number
            output = numeral._.numberToFormat(value, format, roundingFunction);

            // update the before and after based on value
            if (value >= 0) {
                symbols.before = symbols.before.replace(/[\-\(]/, '');
                symbols.after = symbols.after.replace(/[\-\)]/, '');
            } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                symbols.before = '-' + symbols.before;
            }

            // loop through each before symbol
            for (i = 0; i < symbols.before.length; i++) {
                symbol = symbols.before[i];

                switch (symbol) {
                    case '$':
                        output = numeral._.insert(output, locale.currency.symbol, i);
                        break;
                    case ' ':
                        output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                        break;
                }
            }

            // loop through each after symbol
            for (i = symbols.after.length - 1; i >= 0; i--) {
                symbol = symbols.after[i];

                switch (symbol) {
                    case '$':
                        output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                        break;
                    case ' ':
                        output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                        break;
                }
            }


            return output;
        }
    });
})();


(function() {
        numeral.register('format', 'exponential', {
        regexps: {
            format: /(e\+|e-)/,
            unformat: /(e\+|e-)/
        },
        format: function(value, format, roundingFunction) {
            var output,
                exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                parts = exponential.split('e');

            format = format.replace(/e[\+|\-]{1}0/, '');

            output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

            return output + 'e' + parts[1];
        },
        unformat: function(string) {
            var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                value = Number(parts[0]),
                power = Number(parts[1]);

            power = numeral._.includes(string, 'e-') ? power *= -1 : power;

            function cback(accum, curr, currI, O) {
                var corrFactor = numeral._.correctionFactor(accum, curr),
                    num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                return num;
            }

            return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
        }
    });
})();


(function() {
        numeral.register('format', 'ordinal', {
        regexps: {
            format: /(o)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                output,
                ordinal = numeral._.includes(format, ' o') ? ' ' : '';

            // check for space before
            format = format.replace(/\s?o/, '');

            ordinal += locale.ordinal(value);

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + ordinal;
        }
    });
})();


(function() {
        numeral.register('format', 'percentage', {
        regexps: {
            format: /(%)/,
            unformat: /(%)/
        },
        format: function(value, format, roundingFunction) {
            var space = numeral._.includes(format, ' %') ? ' ' : '',
                output;

            if (numeral.options.scalePercentBy100) {
                value = value * 100;
            }

            // check for space before %
            format = format.replace(/\s?\%/, '');

            output = numeral._.numberToFormat(value, format, roundingFunction);

            if (numeral._.includes(output, ')')) {
                output = output.split('');

                output.splice(-1, 0, space + '%');

                output = output.join('');
            } else {
                output = output + space + '%';
            }

            return output;
        },
        unformat: function(string) {
            var number = numeral._.stringToNumber(string);
            if (numeral.options.scalePercentBy100) {
                return number * 0.01;
            }
            return number;
        }
    });
})();


(function() {
        numeral.register('format', 'time', {
        regexps: {
            format: /(:)/,
            unformat: /(:)/
        },
        format: function(value, format, roundingFunction) {
            var hours = Math.floor(value / 60 / 60),
                minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

            return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        },
        unformat: function(string) {
            var timeArray = string.split(':'),
                seconds = 0;

            // turn hours and minutes into seconds and add them all up
            if (timeArray.length === 3) {
                // hours
                seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                // minutes
                seconds = seconds + (Number(timeArray[1]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[2]);
            } else if (timeArray.length === 2) {
                // minutes
                seconds = seconds + (Number(timeArray[0]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[1]);
            }
            return Number(seconds);
        }
    });
})();

return numeral;
}));

},{}],"node_modules/relative-time-format/locale/en/long.json":[function(require,module,exports) {
module.exports = {
	"year": {
		"previous": "last year",
		"current": "this year",
		"next": "next year",
		"past": {
			"one": "{0} year ago",
			"other": "{0} years ago"
		},
		"future": {
			"one": "in {0} year",
			"other": "in {0} years"
		}
	},
	"quarter": {
		"previous": "last quarter",
		"current": "this quarter",
		"next": "next quarter",
		"past": {
			"one": "{0} quarter ago",
			"other": "{0} quarters ago"
		},
		"future": {
			"one": "in {0} quarter",
			"other": "in {0} quarters"
		}
	},
	"month": {
		"previous": "last month",
		"current": "this month",
		"next": "next month",
		"past": {
			"one": "{0} month ago",
			"other": "{0} months ago"
		},
		"future": {
			"one": "in {0} month",
			"other": "in {0} months"
		}
	},
	"week": {
		"previous": "last week",
		"current": "this week",
		"next": "next week",
		"past": {
			"one": "{0} week ago",
			"other": "{0} weeks ago"
		},
		"future": {
			"one": "in {0} week",
			"other": "in {0} weeks"
		}
	},
	"day": {
		"previous": "yesterday",
		"current": "today",
		"next": "tomorrow",
		"past": {
			"one": "{0} day ago",
			"other": "{0} days ago"
		},
		"future": {
			"one": "in {0} day",
			"other": "in {0} days"
		}
	},
	"hour": {
		"current": "this hour",
		"past": {
			"one": "{0} hour ago",
			"other": "{0} hours ago"
		},
		"future": {
			"one": "in {0} hour",
			"other": "in {0} hours"
		}
	},
	"minute": {
		"current": "this minute",
		"past": {
			"one": "{0} minute ago",
			"other": "{0} minutes ago"
		},
		"future": {
			"one": "in {0} minute",
			"other": "in {0} minutes"
		}
	},
	"second": {
		"current": "now",
		"past": {
			"one": "{0} second ago",
			"other": "{0} seconds ago"
		},
		"future": {
			"one": "in {0} second",
			"other": "in {0} seconds"
		}
	}
};
},{}],"node_modules/relative-time-format/locale/en/short.json":[function(require,module,exports) {
module.exports = {
	"year": {
		"previous": "last yr.",
		"current": "this yr.",
		"next": "next yr.",
		"past": "{0} yr. ago",
		"future": "in {0} yr."
	},
	"quarter": {
		"previous": "last qtr.",
		"current": "this qtr.",
		"next": "next qtr.",
		"past": {
			"one": "{0} qtr. ago",
			"other": "{0} qtrs. ago"
		},
		"future": {
			"one": "in {0} qtr.",
			"other": "in {0} qtrs."
		}
	},
	"month": {
		"previous": "last mo.",
		"current": "this mo.",
		"next": "next mo.",
		"past": "{0} mo. ago",
		"future": "in {0} mo."
	},
	"week": {
		"previous": "last wk.",
		"current": "this wk.",
		"next": "next wk.",
		"past": "{0} wk. ago",
		"future": "in {0} wk."
	},
	"day": {
		"previous": "yesterday",
		"current": "today",
		"next": "tomorrow",
		"past": {
			"one": "{0} day ago",
			"other": "{0} days ago"
		},
		"future": {
			"one": "in {0} day",
			"other": "in {0} days"
		}
	},
	"hour": {
		"current": "this hour",
		"past": "{0} hr. ago",
		"future": "in {0} hr."
	},
	"minute": {
		"current": "this minute",
		"past": "{0} min. ago",
		"future": "in {0} min."
	},
	"second": {
		"current": "now",
		"past": "{0} sec. ago",
		"future": "in {0} sec."
	}
};
},{}],"node_modules/relative-time-format/locale/en/narrow.json":[function(require,module,exports) {
module.exports = {
	"year": {
		"previous": "last yr.",
		"current": "this yr.",
		"next": "next yr.",
		"past": "{0} yr. ago",
		"future": "in {0} yr."
	},
	"quarter": {
		"previous": "last qtr.",
		"current": "this qtr.",
		"next": "next qtr.",
		"past": {
			"one": "{0} qtr. ago",
			"other": "{0} qtrs. ago"
		},
		"future": {
			"one": "in {0} qtr.",
			"other": "in {0} qtrs."
		}
	},
	"month": {
		"previous": "last mo.",
		"current": "this mo.",
		"next": "next mo.",
		"past": "{0} mo. ago",
		"future": "in {0} mo."
	},
	"week": {
		"previous": "last wk.",
		"current": "this wk.",
		"next": "next wk.",
		"past": "{0} wk. ago",
		"future": "in {0} wk."
	},
	"day": {
		"previous": "yesterday",
		"current": "today",
		"next": "tomorrow",
		"past": {
			"one": "{0} day ago",
			"other": "{0} days ago"
		},
		"future": {
			"one": "in {0} day",
			"other": "in {0} days"
		}
	},
	"hour": {
		"current": "this hour",
		"past": "{0} hr. ago",
		"future": "in {0} hr."
	},
	"minute": {
		"current": "this minute",
		"past": "{0} min. ago",
		"future": "in {0} min."
	},
	"second": {
		"current": "now",
		"past": "{0} sec. ago",
		"future": "in {0} sec."
	}
};
},{}],"node_modules/relative-time-format/locale/en/quantify.js":[function(require,module,exports) {
module.exports=function(n){var r=!String(n).split(".")[1];return 1==n&&r?"one":"other"}
},{}],"node_modules/relative-time-format/locale/en/index.js":[function(require,module,exports) {
module.exports = {
	locale: 'en',
	long: require('./long.json'),
	short: require('./short.json'),
	narrow: require('./narrow.json'),
	quantify: require('./quantify')
}
},{"./long.json":"node_modules/relative-time-format/locale/en/long.json","./short.json":"node_modules/relative-time-format/locale/en/short.json","./narrow.json":"node_modules/relative-time-format/locale/en/narrow.json","./quantify":"node_modules/relative-time-format/locale/en/quantify.js"}],"node_modules/javascript-time-ago/locale-more-styles/en/short-time.json":[function(require,module,exports) {
module.exports =  {
	"year": "{0} yr.",
	"month": "{0} mo.",
	"week": "{0} wk.",
	"day": {
		"one": "{0} day",
		"other": "{0} days"
	},
	"hour": "{0} hr.",
	"minute": "{0} min.",
	"second": "{0} sec.",
	"now": "now"
};
},{}],"node_modules/javascript-time-ago/locale-more-styles/en/short-convenient.json":[function(require,module,exports) {
module.exports = {
	"year": {
		"previous": "last yr.",
		"current": "this yr.",
		"next": "next yr.",
		"past": "{0} yr. ago",
		"future": "in {0} yr."
	},
	"quarter": {
		"previous": "last qtr.",
		"current": "this qtr.",
		"next": "next qtr.",
		"past": {
			"one": "{0} qtr. ago",
			"other": "{0} qtrs. ago"
		},
		"future": {
			"one": "in {0} qtr.",
			"other": "in {0} qtrs."
		}
	},
	"month": {
		"previous": "last mo.",
		"current": "this mo.",
		"next": "next mo.",
		"past": "{0} mo. ago",
		"future": "in {0} mo."
	},
	"week": {
		"previous": "last wk.",
		"current": "this wk.",
		"next": "next wk.",
		"past": "{0} wk. ago",
		"future": "in {0} wk."
	},
	"day": {
		"previous": "yesterday",
		"current": "today",
		"next": "tomorrow",
		"past": {
			"one": "{0} day ago",
			"other": "{0} days ago"
		},
		"future": {
			"one": "in {0} day",
			"other": "in {0} days"
		}
	},
	"hour": {
		"current": "this hour",
		"past": "{0} hr. ago",
		"future": "in {0} hr."
	},
	"minute": {
		"current": "this minute",
		"past": "{0} min. ago",
		"future": "in {0} min."
	},
	"second": {
		"current": "now",
		"past": "{0} sec. ago",
		"future": "in {0} sec."
	},
	"now": {
		"future": "in a moment",
		"past": "just now"
	}
};
},{}],"node_modules/javascript-time-ago/locale-more-styles/en/long-time.json":[function(require,module,exports) {
module.exports = {
	"year": {
		"one": "{0} year",
		"other": "{0} years"
	},
	"month": {
		"one": "{0} month",
		"other": "{0} months"
	},
	"week": {
		"one": "{0} week",
		"other": "{0} weeks"
	},
	"day": {
		"one": "{0} day",
		"other": "{0} days"
	},
	"hour": {
		"one": "{0} hour",
		"other": "{0} hours"
	},
	"minute": {
		"one": "{0} minute",
		"other": "{0} minutes"
	},
	"second": {
		"one": "{0} second",
		"other": "{0} seconds"
	},
	"now": {
		"future": "in a moment",
		"past": "just now"
	}
};
},{}],"node_modules/javascript-time-ago/locale-more-styles/en/long-convenient.json":[function(require,module,exports) {
module.exports = {
	"year": {
		"previous": "last year",
		"current": "this year",
		"next": "next year",
		"past": {
			"one": "a year ago",
			"other": "{0} years ago"
		},
		"future": {
			"one": "in a year",
			"other": "in {0} years"
		}
	},
	"quarter": {
		"previous": "last quarter",
		"current": "this quarter",
		"next": "next quarter",
		"past": {
			"one": "a quarter ago",
			"other": "{0} quarters ago"
		},
		"future": {
			"one": "in a quarter",
			"other": "in {0} quarters"
		}
	},
	"month": {
		"previous": "last month",
		"current": "this month",
		"next": "next month",
		"past": {
			"one": "a month ago",
			"other": "{0} months ago"
		},
		"future": {
			"one": "in a month",
			"other": "in {0} months"
		}
	},
	"week": {
		"previous": "last week",
		"current": "this week",
		"next": "next week",
		"past": {
			"one": "a week ago",
			"other": "{0} weeks ago"
		},
		"future": {
			"one": "in a week",
			"other": "in {0} weeks"
		}
	},
	"day": {
		"previous": "yesterday",
		"current": "today",
		"next": "tomorrow",
		"past": {
			"one": "a day ago",
			"other": "{0} days ago"
		},
		"future": {
			"one": "in a day",
			"other": "in {0} days"
		}
	},
	"hour": {
		"current": "this hour",
		"past": {
			"one": "an hour ago",
			"other": "{0} hours ago"
		},
		"future": {
			"one": "in an hour",
			"other": "in {0} hours"
		}
	},
	"minute": {
		"current": "this minute",
		"past": {
			"one": "a minute ago",
			"other": "{0} minutes ago"
		},
		"future": {
			"one": "in a minute",
			"other": "in {0} minutes"
		}
	},
	"second": {
		"current": "now",
		"past": {
			"one": "a second ago",
			"other": "{0} seconds ago"
		},
		"future": {
			"one": "in a second",
			"other": "in {0} seconds"
		}
	},
	"now": {
		"future": "in a moment",
		"past": "just now"
	}
};
},{}],"node_modules/javascript-time-ago/locale-more-styles/en/tiny.json":[function(require,module,exports) {
module.exports = {
	"year": "{0}yr",
	"month": "{0}mo",
	"week": "{0}wk",
	"day": "{0}d",
	"hour": "{0}h",
	"minute": "{0}m",
	"second": "{0}s",
	"now": "now"
};
},{}],"node_modules/javascript-time-ago/locale/en/index.js":[function(require,module,exports) {
var locale = require('relative-time-format/locale/en')

module.exports = {
	locale: locale.locale,
	// Standard styles.
	long: locale.long,
	short: locale.short,
	narrow: locale.narrow,
	// Additional styles.
	'short-time': require('../../locale-more-styles/en/short-time.json'),
	'short-convenient': require('../../locale-more-styles/en/short-convenient.json'),
	'long-time': require('../../locale-more-styles/en/long-time.json'),
	'long-convenient': require('../../locale-more-styles/en/long-convenient.json'),
	'tiny': require('../../locale-more-styles/en/tiny.json'),
	// Quantifier.
	quantify: locale.quantify
}
},{"relative-time-format/locale/en":"node_modules/relative-time-format/locale/en/index.js","../../locale-more-styles/en/short-time.json":"node_modules/javascript-time-ago/locale-more-styles/en/short-time.json","../../locale-more-styles/en/short-convenient.json":"node_modules/javascript-time-ago/locale-more-styles/en/short-convenient.json","../../locale-more-styles/en/long-time.json":"node_modules/javascript-time-ago/locale-more-styles/en/long-time.json","../../locale-more-styles/en/long-convenient.json":"node_modules/javascript-time-ago/locale-more-styles/en/long-convenient.json","../../locale-more-styles/en/tiny.json":"node_modules/javascript-time-ago/locale-more-styles/en/tiny.json"}],"index.js":[function(require,module,exports) {
"use strict";

var _redditApi = _interopRequireDefault(require("./redditApi"));

var _javascriptTimeAgo = _interopRequireDefault(require("javascript-time-ago"));

var _numeral = _interopRequireDefault(require("numeral"));

var _en = _interopRequireDefault(require("javascript-time-ago/locale/en"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load locale-specific relative date/time formatting rules.
// Add locale-specific relative date/time formatting rules.
_javascriptTimeAgo.default.addLocale(_en.default);

var searchForm = document.getElementById('search-form');
var searchInput = document.getElementById('search-input');
var list = document.getElementById('list');
var grid = document.getElementById('grid');
searchForm.addEventListener('submit', function (e) {
  // Get search term
  var searchTerm = searchInput.value;

  if (searchTerm === '') {
    showMessage('Please add a search term');
  }

  e.preventDefault(); //Clear input

  searchInput.value = ''; //Adding an loader before data view

  var loader = "<div id=\"loading\" class=\"loading\"> Loading&#8230; </div>";
  document.getElementById('results').innerHTML = loader; //Search Reddit

  _redditApi.default.search(searchTerm).then(function (results) {
    console.log(results); //List

    var output = '<div class="result">';
    results.forEach(function (post) {
      var ts = new Date(post.created);
      var timeAgo = new _javascriptTimeAgo.default('en-US');
      var date = timeAgo.format(Date.now() - ts);
      var follow = (0, _numeral.default)(post.subreddit_subscribers).format('0a');
      var image = post.preview ? post.preview.images[0].source.url : "https://secure.webtoolhub.com/static/resources/icons/set26/1bc50a8d1fed.png";
      output += "\n        <div class=\"card\" id='list-card'>\n        <div class=\"card-body\">\n        <img src=\"".concat(image, "\" class=\"img\" alt=\"...\">\n          <div class='content'>\n          <p class=\"card-text\" id='header'>").concat(truncateText(post.title, 80), "</p>\n          <p class=\"card-text\" id='p'>submitted ").concat(date, " by <a href = \"\"> ").concat(post.author_fullname, "</a></p>\n          <div class=\"comment-subscribe\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\"\nwidth=\"18\" height=\"18\"\nviewBox=\"0 0 172 172\"\nstyle=\" fill:#000000;\"><g fill=\"none\" fill-rule=\"nonzero\" stroke=\"none\" stroke-width=\"1\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" stroke-miterlimit=\"10\" stroke-dasharray=\"\" stroke-dashoffset=\"0\" font-family=\"none\" font-weight=\"none\" font-size=\"none\" text-anchor=\"none\" style=\"mix-blend-mode: normal\"><path d=\"M0,172v-172h172v172z\" fill=\"none\"></path><g fill=\"#e74c3c\"><g id=\"surface1\"><path d=\"M86,14.00188c-43.45687,0 -78.87812,30.44937 -78.87812,68.55812c0,22.11813 12.12062,41.37406 30.73156,53.965c-0.02687,0.73906 0.02688,1.935 -0.94062,5.53625c-1.20938,4.44781 -3.64156,10.72313 -8.57313,17.79125l-3.50719,5.02563h6.1275c21.23125,0 33.51313,-13.84063 35.42125,-16.05781c6.31563,1.47812 12.81938,2.29781 19.61875,2.29781c43.45688,0 78.87813,-30.44938 78.87813,-68.55813c0,-38.10875 -35.42125,-68.55812 -78.87813,-68.55812zM86,20.39813c40.48719,0 72.48188,28.03062 72.48188,62.16187c0,34.13125 -31.99469,62.16188 -72.48188,62.16188c-7.01437,0 -13.62562,-0.67188 -19.83375,-2.29781l-1.98875,-0.52406l-1.30344,1.59906c0,0 -9.93031,11.20687 -25.78656,13.90781c2.87563,-5.18688 4.99875,-10.02438 5.97969,-13.67938c1.38406,-5.09281 1.41094,-8.53281 1.41094,-8.53281v-1.76031l-1.47813,-0.94063c-18.1675,-11.55625 -29.48187,-29.44156 -29.48187,-49.93375c0,-34.13125 31.99469,-62.16187 72.48187,-62.16187zM51.6,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88zM86,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88zM120.4,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88z\"></path></g></g></g></svg> \n").concat(post.num_comments, " comments\n   <svg id=\"subscribe\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\"\nwidth=\"18\" height=\"18\"\nviewBox=\"0 0 172 172\"\nstyle=\" fill:#000000;\"><g fill=\"none\" fill-rule=\"nonzero\" stroke=\"none\" stroke-width=\"1\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" stroke-miterlimit=\"10\" stroke-dasharray=\"\" stroke-dashoffset=\"0\" font-family=\"none\" font-weight=\"none\" font-size=\"none\" text-anchor=\"none\" style=\"mix-blend-mode: normal\"><path d=\"M0,172v-172h172v172z\" fill=\"none\"></path><g fill=\"#e74c3c\"><path d=\"M21.5,21.5c-7.83362,0 -14.33333,6.49972 -14.33333,14.33333v93.16667h14.33333v-93.16667h114.66667v-14.33333zM50.16667,50.16667c-7.90483,0 -14.33333,6.4285 -14.33333,14.33333v71.66667c0,7.90483 6.4285,14.33333 14.33333,14.33333h55.59765l2.09961,-2.09961l5.06706,-5.06706l-5.06706,-5.06706l-2.09961,-2.09961h-55.59765v-52.84017l50.16667,31.34017l50.16667,-31.34017l0.014,22.43782l14.31934,-14.33333v-26.93099c0,-7.90483 -6.4285,-14.33333 -14.33333,-14.33333zM50.16667,64.5h100.33333v4.49316l-50.16667,31.34017l-50.16667,-31.34017zM128.13216,117.99805l-10.13411,10.13411l15.20117,15.20117l-15.20117,15.20117l10.13411,10.13411l15.20117,-15.20117l15.20117,15.20117l10.13411,-10.13411l-15.20117,-15.20117l15.20117,-15.20117l-10.13411,-10.13411l-15.20117,15.20117z\"></path></g></g></svg>          \n").concat(follow, " subscribers\n          </div>\n                    \n          </div>\n          <p id='domain'>\n          <button type=\"button\" class=\"btn btn-light\">Readit</button>\n           </p>\n        </div>\n      </div>\n        ");
    });
    output += '</div>';
    document.getElementById('results').innerHTML = output;
    list.addEventListener('click', function (e) {
      document.getElementById("grid-svg").style.fill = "rgb(200, 200, 200)";
      document.getElementById("list-svg").style.fill = "black";
      document.getElementById('results').innerHTML = output;
    }); //Grid

    grid.addEventListener('click', function (e) {
      document.getElementById("grid-svg").style.fill = "black";
      document.getElementById("list-svg").style.fill = "rgb(200, 200, 200)";
      var output = '<div class="card-columns">';
      results.forEach(function (post) {
        var ts = new Date(post.created);
        var timeAgo = new _javascriptTimeAgo.default('en-US');
        var date = timeAgo.format(Date.now() - ts);
        var follow = (0, _numeral.default)(post.subreddit_subscribers).format('0a');
        var image = post.preview ? post.preview.images[0].source.url : "https://secure.webtoolhub.com/static/resources/icons/set26/1bc50a8d1fed.png";
        output += "\n        <div class=\"card\" id=\"grid-card\">\n        <p class=\"card-title\" id=\"submit\">submitted ".concat(date, " by <a href = \"\"> ").concat(post.author_fullname, "</a></p>\n        <h5 class=\"card-title\">").concat(truncateText(post.title, 80), "</h5>\n        <img src=\"").concat(image, "\" class=\"card-img-top\" alt=\"...\">\n        <div class=\"card-body\">\n        <div class=\"comment-subscribe\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\"\nwidth=\"18\" height=\"18\"\nviewBox=\"0 0 172 172\"\nstyle=\" fill:#000000;\"><g fill=\"none\" fill-rule=\"nonzero\" stroke=\"none\" stroke-width=\"1\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" stroke-miterlimit=\"10\" stroke-dasharray=\"\" stroke-dashoffset=\"0\" font-family=\"none\" font-weight=\"none\" font-size=\"none\" text-anchor=\"none\" style=\"mix-blend-mode: normal\"><path d=\"M0,172v-172h172v172z\" fill=\"none\"></path><g fill=\"#e74c3c\"><g id=\"surface1\"><path d=\"M86,14.00188c-43.45687,0 -78.87812,30.44937 -78.87812,68.55812c0,22.11813 12.12062,41.37406 30.73156,53.965c-0.02687,0.73906 0.02688,1.935 -0.94062,5.53625c-1.20938,4.44781 -3.64156,10.72313 -8.57313,17.79125l-3.50719,5.02563h6.1275c21.23125,0 33.51313,-13.84063 35.42125,-16.05781c6.31563,1.47812 12.81938,2.29781 19.61875,2.29781c43.45688,0 78.87813,-30.44938 78.87813,-68.55813c0,-38.10875 -35.42125,-68.55812 -78.87813,-68.55812zM86,20.39813c40.48719,0 72.48188,28.03062 72.48188,62.16187c0,34.13125 -31.99469,62.16188 -72.48188,62.16188c-7.01437,0 -13.62562,-0.67188 -19.83375,-2.29781l-1.98875,-0.52406l-1.30344,1.59906c0,0 -9.93031,11.20687 -25.78656,13.90781c2.87563,-5.18688 4.99875,-10.02438 5.97969,-13.67938c1.38406,-5.09281 1.41094,-8.53281 1.41094,-8.53281v-1.76031l-1.47813,-0.94063c-18.1675,-11.55625 -29.48187,-29.44156 -29.48187,-49.93375c0,-34.13125 31.99469,-62.16187 72.48187,-62.16187zM51.6,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88zM86,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88zM120.4,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88z\"></path></g></g></g></svg> \n").concat(post.num_comments, " comments\n   <svg id=\"subscribe\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\"\nwidth=\"18\" height=\"18\"\nviewBox=\"0 0 172 172\"\nstyle=\" fill:#000000;\"><g fill=\"none\" fill-rule=\"nonzero\" stroke=\"none\" stroke-width=\"1\" stroke-linecap=\"butt\" stroke-linejoin=\"miter\" stroke-miterlimit=\"10\" stroke-dasharray=\"\" stroke-dashoffset=\"0\" font-family=\"none\" font-weight=\"none\" font-size=\"none\" text-anchor=\"none\" style=\"mix-blend-mode: normal\"><path d=\"M0,172v-172h172v172z\" fill=\"none\"></path><g fill=\"#e74c3c\"><path d=\"M21.5,21.5c-7.83362,0 -14.33333,6.49972 -14.33333,14.33333v93.16667h14.33333v-93.16667h114.66667v-14.33333zM50.16667,50.16667c-7.90483,0 -14.33333,6.4285 -14.33333,14.33333v71.66667c0,7.90483 6.4285,14.33333 14.33333,14.33333h55.59765l2.09961,-2.09961l5.06706,-5.06706l-5.06706,-5.06706l-2.09961,-2.09961h-55.59765v-52.84017l50.16667,31.34017l50.16667,-31.34017l0.014,22.43782l14.31934,-14.33333v-26.93099c0,-7.90483 -6.4285,-14.33333 -14.33333,-14.33333zM50.16667,64.5h100.33333v4.49316l-50.16667,31.34017l-50.16667,-31.34017zM128.13216,117.99805l-10.13411,10.13411l15.20117,15.20117l-15.20117,15.20117l10.13411,10.13411l15.20117,-15.20117l15.20117,15.20117l10.13411,-10.13411l-15.20117,-15.20117l15.20117,-15.20117l-10.13411,-10.13411l-15.20117,15.20117z\"></path></g></g></svg>          \n").concat(follow, " subscribers\n          </div>\n      </div>\n       \n      </div>\n        ");
      });
      output += '</div>';
      document.getElementById('results').innerHTML = output;
    });
  });
}); //show message

function showMessage(message, className) {
  var div = document.createElement('div');
  div.className = "\nalert ".concat(className, "\n");
  div.appendChild(document.createTextNode(message));
  var searchContainer = document.getElementById('search-container');
  var search = document.getElementById('search');
  searchContainer.insertBefore(div, search);
  setTimeout(function () {
    return document.querySelector('.alert').remove();
  }, 3000);
}

function truncateText(text, limit) {
  var shortened = text.indexOf(' ', limit);
  if (shortened === -1) return text;
  return text.substring(0, shortened);
}
},{"./redditApi":"redditApi.js","javascript-time-ago":"node_modules/javascript-time-ago/index.js","numeral":"node_modules/numeral/numeral.js","javascript-time-ago/locale/en":"node_modules/javascript-time-ago/locale/en/index.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "6097" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/Reddit-Search.e31bb0bc.js.map