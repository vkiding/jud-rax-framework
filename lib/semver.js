'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = {
  satisfies: function satisfies(left, right) {
    var regex = /(\W+)?([\d|.]+)/;

    if ((typeof left === 'undefined' ? 'undefined' : _typeof(left)) + (typeof right === 'undefined' ? 'undefined' : _typeof(right)) != 'stringstring') return false;

    if (right == '*') {
      return true;
    }

    var arr = right.match(regex);
    var a = left.split('.'),
        i = 0,
        b = arr[2].split('.'),
        len = Math.max(a.length, b.length);

    var flag = 0;
    for (var _i = 0; _i < len; _i++) {
      if (a[_i] && !b[_i] && parseInt(a[_i]) > 0 || parseInt(a[_i]) > parseInt(b[_i])) {
        flag = 1;
        break;
      } else if (b[_i] && !a[_i] && parseInt(b[_i]) > 0 || parseInt(a[_i]) < parseInt(b[_i])) {
        flag = -1;
        break;
      }
    }

    switch (arr[1]) {
      case '<':
        if (flag === -1) {
          return true;
        }
        break;
      case '<=':
        if (flag !== 1) {
          return true;
        }
        break;
      case '>':
        if (flag === 1) {
          return true;
        }
        break;
      case '>=':
        if (flag !== -1) {
          return true;
        }
        break;
      default:
        if (flag === 0) {
          return true;
        }
        break;
    }
    return false;
  }
};
module.exports = exports['default'];