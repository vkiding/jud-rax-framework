'use strict';

var _semver = require('./semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeVersion(v) {
  if (v == '*') {
    return v;
  }
  v = typeof v === 'string' ? v : '';
  var split = v.split('.');
  var i = 0;
  var result = [];

  while (i < 3) {
    var s = typeof split[i] === 'string' && split[i] ? split[i] : '0';
    result.push(s);
    i++;
  }

  return result.join('.');
} /* global WXEnvironment */

function getError(key, val, criteria) {
  var result = {
    isDowngrade: true,
    errorType: 1,
    code: 1000
  };
  var getMsg = function getMsg(key, val, criteria) {
    return 'Downgrade[' + key + '] :: deviceInfo ' + val + ' matched criteria ' + criteria;
  };
  var _key = key.toLowerCase();

  if (_key.indexOf('osversion') >= 0) {
    result.code = 1001;
  } else if (_key.indexOf('appversion') >= 0) {
    result.code = 1002;
  } else if (_key.indexOf('judversion') >= 0) {
    result.code = 1003;
  } else if (_key.indexOf('devicemodel') >= 0) {
    result.code = 1004;
  }

  result.errorMessage = getMsg(key, val, criteria);
  return result;
}

/**
 * config
 *
 * {
 *   ios: {
 *     osVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     appVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     judVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     deviceModel: ['modelA', 'modelB', ...]
 *   },
 *   android: {
 *     osVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     appVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     judVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     deviceModel: ['modelA', 'modelB', ...]
 *   }
 * }
 *
 */
function check(config) {
  var result = {
    isDowngrade: false
  };

  var deviceInfo = WXEnvironment;

  var platform = deviceInfo.platform || 'unknow';
  var dPlatform = platform.toLowerCase();
  var cObj = config[dPlatform] || {};

  for (var i in deviceInfo) {
    var key = i;
    var keyLower = key.toLowerCase();
    var val = deviceInfo[i];
    var isVersion = keyLower.indexOf('version') >= 0;
    var isDeviceModel = keyLower.indexOf('devicemodel') >= 0;
    var criteria = cObj[i];

    if (criteria && isVersion) {
      var c = normalizeVersion(criteria);
      var d = normalizeVersion(deviceInfo[i]);

      if (_semver2.default.satisfies(d, c)) {
        result = getError(key, val, criteria);
        break;
      }
    } else if (isDeviceModel) {
      var _criteria = Array.isArray(criteria) ? criteria : [criteria];

      if (_criteria.indexOf(val) >= 0) {
        result = getError(key, val, criteria);
        break;
      }
    }
  }

  return result;
}

module.exports = function (__jud_require__) {
  return function (config) {
    var nativeInstanceWrap = __jud_require__('@jud-module/instanceWrap');
    var result = check(config);
    if (result.isDowngrade) {
      nativeInstanceWrap.error(result.errorType, result.code, result.errorMessage);
      return true;
    }
    return false;
  };
};