'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getInstance = getInstance;
exports.init = init;
exports.registerComponents = registerComponents;
exports.registerMethods = registerMethods;
exports.registerModules = registerModules;
exports.createInstance = createInstance;
exports.refreshInstance = refreshInstance;
exports.destroyInstance = destroyInstance;
exports.getRoot = getRoot;
exports.receiveTasks = receiveTasks;

var _builtin = require('./builtin');

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeComponents = {};
var NativeModules = {};

var Document = void 0;
var Element = void 0;
var Comment = void 0;
var Listener = void 0;
var TaskCenter = void 0;
var CallbackManager = void 0;
var sendTasks = void 0;

var MODULE_NAME_PREFIX = '@jud-module/';
var MODAL_MODULE = MODULE_NAME_PREFIX + 'modal';
var NAVIGATOR_MODULE = MODULE_NAME_PREFIX + 'navigator';
// Instance hub
var instances = {};

function dispatchEventToInstance(event, targetOrigin) {
  var instance;
  for (var i in instances) {
    if (instances.hasOwnProperty(i)) {
      instance = instances[i];
      if (targetOrigin === '*' || targetOrigin === instance.origin) {
        event.target = instance.window;
        // FIXME: Need async?
        instance.window.dispatchEvent(event);
      }
    }
  }
}

function getInstance(instanceId) {
  var instance = instances[instanceId];
  if (!instance) {
    throw new Error('Invalid instance id "' + instanceId + '"');
  }
  return instance;
}

function init(config) {
  Document = config.Document;
  Element = config.Element;
  Comment = config.Comment;
  Listener = config.Listener;
  TaskCenter = config.TaskCenter;
  CallbackManager = config.CallbackManager;
  sendTasks = config.sendTasks;
}

/**
 * register the name of each native component
 * @param  {array} components array of name
 */
function registerComponents(components) {
  if (Array.isArray(components)) {
    components.forEach(function register(name) {
      /* istanbul ignore if */
      if (!name) {
        return;
      }
      if (typeof name === 'string') {
        NativeComponents[name] = true;
      } else if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && typeof name.type === 'string') {
        NativeComponents[name.type] = name;
      }
    });
  }
}

/**
 * register the name and methods of each api
 * @param  {object} apis a object of apis
 */
function registerMethods(apis) {}
// Noop


/**
 * register the name and methods of each module
 * @param  {object} modules a object of modules
 */
function registerModules(newModules) {
  if ((typeof newModules === 'undefined' ? 'undefined' : _typeof(newModules)) === 'object') {
    for (var name in newModules) {
      if (Object.prototype.hasOwnProperty.call(newModules, name)) {
        NativeModules[name] = newModules[name];
      }
    }
  }
}

function genBuiltinModules(modules, moduleFactories, context) {
  for (var moduleName in moduleFactories) {
    modules[moduleName] = {
      factory: moduleFactories[moduleName].bind(context),
      module: { exports: {} },
      isInitialized: false
    };
  }
  return modules;
}

function genNativeModules(modules, instanceId) {
  if ((typeof NativeModules === 'undefined' ? 'undefined' : _typeof(NativeModules)) === 'object') {
    var _loop = function _loop(name) {
      var moduleName = MODULE_NAME_PREFIX + name;
      modules[moduleName] = {
        module: { exports: {} },
        isInitialized: true
      };

      NativeModules[name].forEach(function (method) {
        if (typeof method === 'string') {
          method = {
            name: method
          };
        }

        var methodName = method.name;

        modules[moduleName].module.exports[methodName] = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var finalArgs = [];
          args.forEach(function (arg, index) {
            var value = args[index];
            finalArgs[index] = normalize(value, getInstance(instanceId));
          });

          sendTasks(String(instanceId), [{
            module: name,
            method: methodName,
            args: finalArgs
          }], '-1');
        };
      });
    };

    for (var name in NativeModules) {
      _loop(name);
    }
  }

  return modules;
}

/**
 * create a Jud instance
 *
 * @param  {string} instanceId
 * @param  {string} __jud_code__
 * @param  {object} [__jud_options__] {bundleUrl, debug}
 */
function createInstance(instanceId, __jud_code__, __jud_options__, __jud_data__, __jud_config__) {
  var instance = instances[instanceId];
  if (instance == undefined) {
    (function () {
      // Mark start time
      var responseEnd = Date.now();
      var __jud_env__ = (typeof WXEnvironment === 'undefined' ? 'undefined' : _typeof(WXEnvironment)) === 'object' && WXEnvironment || {};

      var Promise = require('runtime-shared/dist/promise.function')();
      var URL = require('runtime-shared/dist/url.function')();
      var URLSearchParams = require('runtime-shared/dist/url-search-params.function')();
      var FontFace = require('runtime-shared/dist/fontface.function')();
      var matchMedia = require('runtime-shared/dist/matchMedia.function')();

      var document = new Document(instanceId, __jud_options__.bundleUrl, null, Listener);
      var location = new URL(__jud_options__.bundleUrl);
      var modules = {};

      instance = instances[instanceId] = {
        document: document,
        instanceId: instanceId,
        modules: modules,
        origin: location.origin,
        callbacks: [],
        uid: 0
      };

      // Generate native modules map at instance init
      genNativeModules(modules, instanceId);
      var __jud_define__ = require('./define.jud')(modules);
      var __jud_require__ = require('./require.jud')(modules);
      var __jud_downgrade__ = require('./downgrade.jud')(__jud_require__);
      // Extend document
      require('./document.jud')(__jud_require__, document);

      var _require = require('./fetch.jud')(__jud_require__, Promise),
          fetch = _require.fetch,
          Headers = _require.Headers,
          Request = _require.Request,
          Response = _require.Response;

      var _require2 = require('./timer.jud')(__jud_require__, instance),
          setTimeout = _require2.setTimeout,
          clearTimeout = _require2.clearTimeout,
          setInterval = _require2.setInterval,
          clearInterval = _require2.clearInterval,
          requestAnimationFrame = _require2.requestAnimationFrame,
          cancelAnimationFrame = _require2.cancelAnimationFrame;

      var _require3 = require('./base64.jud')(),
          atob = _require3.atob,
          btoa = _require3.btoa;

      var performance = require('./performance.jud')(responseEnd);

      var windowEmitter = new _emitter2.default();
      var window = {
        // ES
        Promise: Promise,
        // W3C: https://www.w3.org/TR/html5/browsers.html#browsing-context-name
        name: '',
        // This read-only property indicates whether the referenced window is closed or not.
        closed: false,
        atob: atob,
        btoa: btoa,
        performance: performance,
        // W3C
        document: document,
        location: location,
        // https://www.w3.org/TR/2009/WD-html5-20090423/browsers.html#dom-navigator
        navigator: {
          product: 'Jud',
          platform: __jud_env__.platform,
          appName: __jud_env__.appName,
          appVersion: __jud_env__.appVersion
        },
        // https://drafts.csswg.org/cssom-view/#the-screen-interface
        screen: {
          width: __jud_env__.deviceWidth,
          height: __jud_env__.deviceHeight,
          availWidth: __jud_env__.deviceWidth,
          availHeight: __jud_env__.deviceHeight,
          colorDepth: 24,
          pixelDepth: 24
        },
        devicePixelRatio: __jud_env__.scale,
        fetch: fetch,
        Headers: Headers,
        Response: Response,
        Request: Request,
        URL: URL,
        URLSearchParams: URLSearchParams,
        FontFace: FontFace,
        matchMedia: matchMedia,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        requestAnimationFrame: requestAnimationFrame,
        cancelAnimationFrame: cancelAnimationFrame,
        alert: function alert(message) {
          var modal = __jud_require__(MODAL_MODULE);
          modal.alert({
            message: message
          }, function () {});
        },
        open: function open(url) {
          var judNavigator = __jud_require__(NAVIGATOR_MODULE);
          judNavigator.push({
            url: url,
            animated: 'true'
          }, function (e) {
            // noop
          });
        },
        postMessage: function postMessage(message, targetOrigin) {
          var event = {
            origin: location.origin,
            data: JSON.parse(JSON.stringify(message)),
            type: 'message',
            source: window };
          dispatchEventToInstance(event, targetOrigin);
        },
        addEventListener: function addEventListener(type, listener) {
          windowEmitter.on(type, listener);
        },
        removeEventListener: function removeEventListener(type, listener) {
          windowEmitter.off(type, listener);
        },
        dispatchEvent: function dispatchEvent(e) {
          windowEmitter.emit(e.type, e);
        },
        // ModuleJS
        define: __jud_define__,
        require: __jud_require__,
        // Jud
        __jud_document__: document,
        __jud_define__: __jud_define__,
        __jud_require__: __jud_require__,
        __jud_downgrade__: __jud_downgrade__,
        __jud_env__: __jud_env__,
        __jud_code__: __jud_code__,
        __jud_options__: __jud_options__,
        __jud_data__: __jud_data__
      };

      instance.window = window.self = window.window = window;

      var builtinGlobals = {};
      var builtinModules = {};
      try {
        builtinGlobals = __jud_config__.services.builtinGlobals;
        // Modules should wrap as module factory format
        builtinModules = __jud_config__.services.builtinModules;
      } catch (e) {}

      Object.assign(window, builtinGlobals);

      var moduleFactories = _extends({}, _builtin.ModuleFactories, builtinModules);
      genBuiltinModules(modules, moduleFactories, window);

      if (__jud_env__.platform !== 'Web') {
        var timing = performance.timing;
        timing.domLoading = Date.now();

        var _init = new Function('with(this){(function(){"use strict";\n' + __jud_code__ + '\n}).call(this)}');

        _init.call(
        // Context is window
        window);

        timing.domInteractive = timing.domComplete = timing.domInteractive = Date.now();
      } else {
        var _init2 = new Function('"use strict";\n' + __jud_code__);

        _init2.call(window);
      }
    })();
  } else {
    throw new Error('Instance id "' + instanceId + '" existed when create instance');
  }
}

/**
 * refresh a Jud instance
 *
 * @param  {string} instanceId
 * @param  {object} data
 */
function refreshInstance(instanceId, data) {
  var instance = getInstance(instanceId);
  var document = instance.document;
  document.documentElement.fireEvent('refresh', {
    timestamp: Date.now(),
    data: data
  });
  document.listener.refreshFinish();
}

/**
 * destroy a Jud instance
 * @param  {string} instanceId
 */
function destroyInstance(instanceId) {
  var instance = getInstance(instanceId);
  instance.window.closed = true;
  var document = instance.document;
  document.documentElement.fireEvent('destory', {
    timestamp: Date.now()
  });
  if (document.destroy) {
    document.destroy();
  }

  delete instances[instanceId];
}

/**
 * get a whole element tree of an instance
 * for debugging
 * @param  {string} instanceId
 * @return {object} a virtual dom tree
 */
function getRoot(instanceId) {
  var instance = getInstance(instanceId);
  var document = instance.document;
  return document.toJSON ? document.toJSON() : {};
}

function fireEvent(doc, ref, type, e, domChanges) {
  if (Array.isArray(ref)) {
    ref.some(function (ref) {
      return fireEvent(doc, ref, type, e) !== false;
    });
    return;
  }

  var el = doc.getRef(ref);

  if (el) {
    var result = doc.fireEvent(el, type, e, domChanges);
    doc.listener.updateFinish();
    return result;
  }

  return new Error('Invalid element reference "' + ref + '"');
}

function handleCallback(doc, callbacks, callbackId, data, ifKeepAlive) {
  var callback = callbacks[callbackId];
  if (typeof callback === 'function') {
    callback(data);
    if (typeof ifKeepAlive === 'undefined' || ifKeepAlive === false) {
      callbacks[callbackId] = null;
    }
    doc.listener.updateFinish();
    return;
  }

  return new Error('Invalid callback id "' + callbackId + '"');
}

/**
 * accept calls from native (event or callback)
 *
 * @param  {string} instanceId
 * @param  {array} tasks list with `method` and `args`
 */
function receiveTasks(instanceId, tasks) {
  var instance = getInstance(instanceId);
  if (Array.isArray(tasks)) {
    var _ret3 = function () {
      var callbacks = instance.callbacks,
          document = instance.document;

      var results = [];
      tasks.forEach(function (task) {
        var result = void 0;
        if (task.method === 'fireEvent') {
          var _task$args = _slicedToArray(task.args, 4),
              nodeId = _task$args[0],
              type = _task$args[1],
              data = _task$args[2],
              domChanges = _task$args[3];

          result = fireEvent(document, nodeId, type, data, domChanges);
        } else if (task.method === 'callback') {
          var _task$args2 = _slicedToArray(task.args, 3),
              uid = _task$args2[0],
              _data = _task$args2[1],
              ifKeepAlive = _task$args2[2];

          result = handleCallback(document, callbacks, uid, _data, ifKeepAlive);
        }
        results.push(result);
      });
      return {
        v: results
      };
    }();

    if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
  }
}

function normalize(v, instance) {
  var type = typof(v);

  switch (type) {
    case 'undefined':
    case 'null':
      return '';
    case 'regexp':
      return v.toString();
    case 'date':
      return v.toISOString();
    case 'number':
    case 'string':
    case 'boolean':
    case 'array':
    case 'object':
      if (v instanceof Element) {
        return v.ref;
      }
      return v;
    case 'function':
      instance.callbacks[++instance.uid] = v;
      return instance.uid.toString();
    default:
      return JSON.stringify(v);
  }
}

function typof(v) {
  var s = Object.prototype.toString.call(v);
  return s.substring(8, s.length - 1).toLowerCase();
}

// Hack for rollup build "import Rax from 'jud-rax-framework'", in rollup if `module.exports` has `__esModule` key must return by export default
exports.default = exports;