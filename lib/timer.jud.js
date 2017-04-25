'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TIMER_MODULE = '@jud-module/timer';

module.exports = function (__jud_require__, instance) {
  var setTimeout = function setTimeout() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var timer = __jud_require__(TIMER_MODULE);
    var handler = function handler() {
      args[0].apply(args, _toConsumableArray(args.slice(2)));
    };
    timer.setTimeout(handler, args[1]);
    return instance.uid.toString();
  };

  var setInterval = function setInterval() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var timer = __jud_require__(TIMER_MODULE);
    var handler = function handler() {
      args[0].apply(args, _toConsumableArray(args.slice(2)));
    };
    timer.setInterval(handler, args[1]);
    return instance.uid.toString();
  };

  var clearTimeout = function clearTimeout(n) {
    var timer = __jud_require__(TIMER_MODULE);
    timer.clearTimeout(n);
  };

  var clearInterval = function clearInterval(n) {
    var timer = __jud_require__(TIMER_MODULE);
    timer.clearInterval(n);
  };

  var requestAnimationFrame = function requestAnimationFrame(callback) {
    var timer = __jud_require__(TIMER_MODULE);
    timer.setTimeout(callback, 16);
    return instance.uid.toString();
  };

  var cancelAnimationFrame = function cancelAnimationFrame(n) {
    var timer = __jud_require__(TIMER_MODULE);
    timer.clearTimeout(n);
  };

  return {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    requestAnimationFrame: requestAnimationFrame,
    cancelAnimationFrame: cancelAnimationFrame
  };
};