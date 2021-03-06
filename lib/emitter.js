"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._listeners = {};
  }

  /**
   * Adds a listener function to the specified event.
   * @param {String} type
   * @param {Function} listener
   * @param {Boolean} once
   */


  _createClass(EventEmitter, [{
    key: "_addListener",
    value: function _addListener(type, listener, once) {
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push({ listener: listener, once: once });
      return this;
    }

    /**
     * Adds a listener function to the specified event.
     * @param {String} type
     * @param {Function} listener
     * @return {Object} Current instance of EventEmitter for chaining.
     */

  }, {
    key: "on",
    value: function on(type, listener) {
      return this._addListener(type, listener, false);
    }
  }, {
    key: "once",
    value: function once(type, listener) {
      return this._addListener(type, listener, true);
    }

    /**
     * Removes a listener function to the specified event.
     * @param {String} type
     * @param {Function} listener
     * @return {Object} Current instance of EventEmitter for chaining.
     */

  }, {
    key: "off",
    value: function off(type, listener) {
      // alias
      if (!this._listeners[type]) {
        return this;
      }
      if (!this._listeners[type].length) {
        return this;
      }
      if (!listener) {
        delete this._listeners[type];
        return this;
      }
      this._listeners[type] = this._listeners[type].filter(function (_listener) {
        return !(_listener.listener === listener);
      });
      return this;
    }

    /**
     * Emits an specified event.
     * @param {String} type
     * @param {Object} payload
     * @return {Object} Current instance of EventEmitter for chaining.
     */

  }, {
    key: "emit",
    value: function emit(type, payload) {
      var _this = this;

      if (!this._listeners[type]) {
        return this;
      }
      this._listeners[type].forEach(function (_listener) {
        _listener.listener.apply(_this, [payload]);
        if (_listener.once) {
          _this.removeListener(type, _listener.listener);
        }
      });
      return this;
    }
  }]);

  return EventEmitter;
}();

exports.default = EventEmitter;
module.exports = exports["default"];