// Polyfills for cross-browser compatibility

// Core-js polyfills for modern JavaScript features
import 'core-js/stable';

// Promise.allSettled polyfill for older browsers
if (!Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return Promise.all(promises.map(p => Promise.resolve(p).then(
      value => ({ status: 'fulfilled', value }),
      reason => ({ status: 'rejected', reason })
    )));
  };
}

// Optional chaining polyfill (basic implementation)
if (!Object.prototype.hasOwnProperty.call(Object.prototype, '?.')) {
  // This is handled by Babel during build, but adding for extra safety
  console.log('Optional chaining will be handled by Babel transpilation');
}

// Array.prototype.find polyfill for IE
if (!Array.prototype.find) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = parseInt(list.length) || 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      if (predicate.call(thisArg, list[i], i, list)) {
        return list[i];
      }
    }
    return undefined;
  };
}

// Array.prototype.includes polyfill for IE
if (!Array.prototype.includes) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.includes = function(valueToFind, fromIndex) {
    return this.indexOf(valueToFind, fromIndex) !== -1;
  };
}

// String.prototype.includes polyfill for IE
if (!String.prototype.includes) {
  // eslint-disable-next-line no-extend-native
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// CustomEvent polyfill for IE
if (typeof window !== 'undefined' && !window.CustomEvent) {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

// Element.matches polyfill for IE
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || 
                              Element.prototype.webkitMatchesSelector;
}

// Element.closest polyfill for IE
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Console polyfill for IE (basic)
if (typeof console === 'undefined') {
  window.console = {
    log: function() {},
    warn: function() {},
    error: function() {},
    group: function() {},
    groupEnd: function() {},
    groupCollapsed: function() {}
  };
}

console.log('✅ Polyfills loaded for cross-browser compatibility'); 