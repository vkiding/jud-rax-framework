"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function (responseEnd) {
  var _performance$timing;

  var performance = {};
  // TODO: current can not get navigationStart time
  performance.timing = (_performance$timing = {
    unloadEventStart: 0,
    unloadEventEnd: 0,
    navigationStart: responseEnd,
    redirectStart: 0,
    redirectEnd: 0,
    fetchStart: responseEnd,
    domainLookupStart: responseEnd,
    domainLookupEnd: responseEnd,
    connectStart: responseEnd,
    secureConnectionStart: responseEnd
  }, _defineProperty(_performance$timing, "connectStart", responseEnd), _defineProperty(_performance$timing, "requestStart", responseEnd), _defineProperty(_performance$timing, "responseStart", responseEnd), _defineProperty(_performance$timing, "responseEnd", responseEnd), _defineProperty(_performance$timing, "domLoading", 0), _defineProperty(_performance$timing, "domInteractive", 0), _defineProperty(_performance$timing, "domComplete", 0), _defineProperty(_performance$timing, "domContentLoadedEventStart", 0), _defineProperty(_performance$timing, "domContentLoadedEventEnd", 0), _defineProperty(_performance$timing, "loadEventStart", 0), _defineProperty(_performance$timing, "loadEventEnd", 0), _performance$timing);
  performance.now = function () {
    return Date.now() - performance.timing.navigationStart;
  };

  return performance;
};