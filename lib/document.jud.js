'use strict';

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DOM_MODULE = '@jud-module/dom';
var VISIBLE = 'visible';
var HIDDEN = 'hidden';
var VISIBILITY_CHANGE_EVENT = 'visibilitychange';

function addBodyAppearListener(document) {
  document.body.addEvent('viewappear', function (e) {
    document.visibilityState = VISIBLE;
    e.type = VISIBILITY_CHANGE_EVENT;
    document.dispatchEvent(e);
  });

  document.body.addEvent('viewdisappear', function (e) {
    document.visibilityState = HIDDEN;
    e.type = VISIBILITY_CHANGE_EVENT;
    document.dispatchEvent(e);
  });
}

function removeBodyAppearListener(document) {
  if (document.body) {
    document.body.removeEvent('viewappear');
    document.body.removeEvent('viewdisappear');
  }
}

module.exports = function (__jud_require__, document) {
  // Add w3c events
  var documentEmitter = new _emitter2.default();
  var hasVisibilityEventPending = false;

  document.addEventListener = function (type, listener) {
    if (type === VISIBILITY_CHANGE_EVENT) {
      if (document.body) {
        addBodyAppearListener(document);
      } else {
        hasVisibilityEventPending = true;
      }
    }
    documentEmitter.on(type, listener);
  };

  document.removeEventListener = function (type, listener) {
    if (type === VISIBILITY_CHANGE_EVENT) {
      removeBodyAppearListener(document);
    }
    documentEmitter.off(type, listener);
  };

  document.dispatchEvent = function (e) {
    documentEmitter.emit(e.type, e);
  };

  // FontFace
  document.fonts = {
    add: function add(fontFace) {
      var domModule = __jud_require__(DOM_MODULE);
      domModule.addRule('fontFace', {
        fontFamily: fontFace.family,
        src: fontFace.source
      });
    }
  };

  // Init visibility state
  document.visibilityState = VISIBLE;

  // Hijack the origin createBody
  var originCreateBody = document.createBody;
  document.createBody = function () {
    var body = originCreateBody.call(document);

    if (hasVisibilityEventPending) {
      addBodyAppearListener(document);
    }

    return body;
  };

  return document;
};