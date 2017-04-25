module.exports = /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**************************************************!*\
  !*** ./packages/jud-rax-framework/src/index.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

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
	
	var _builtin = __webpack_require__(/*! ./builtin */ 1);
	
	var _emitter = __webpack_require__(/*! ./emitter */ 3);
	
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
	
	      var Promise = __webpack_require__(/*! runtime-shared/dist/promise.function */ 4)();
	      var URL = __webpack_require__(/*! runtime-shared/dist/url.function */ 5)();
	      var URLSearchParams = __webpack_require__(/*! runtime-shared/dist/url-search-params.function */ 6)();
	      var FontFace = __webpack_require__(/*! runtime-shared/dist/fontface.function */ 7)();
	      var matchMedia = __webpack_require__(/*! runtime-shared/dist/matchMedia.function */ 8)();
	
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
	      var __jud_define__ = __webpack_require__(/*! ./define.jud */ 9)(modules);
	      var __jud_require__ = __webpack_require__(/*! ./require.jud */ 10)(modules);
	      var __jud_downgrade__ = __webpack_require__(/*! ./downgrade.jud */ 11)(__jud_require__);
	      // Extend document
	      __webpack_require__(/*! ./document.jud */ 13)(__jud_require__, document);
	
	      var _require = __webpack_require__(/*! ./fetch.jud */ 14)(__jud_require__, Promise),
	          fetch = _require.fetch,
	          Headers = _require.Headers,
	          Request = _require.Request,
	          Response = _require.Response;
	
	      var _require2 = __webpack_require__(/*! ./timer.jud */ 15)(__jud_require__, instance),
	          setTimeout = _require2.setTimeout,
	          clearTimeout = _require2.clearTimeout,
	          setInterval = _require2.setInterval,
	          clearInterval = _require2.clearInterval,
	          requestAnimationFrame = _require2.requestAnimationFrame,
	          cancelAnimationFrame = _require2.cancelAnimationFrame;
	
	      var _require3 = __webpack_require__(/*! ./base64.jud */ 16)(),
	          atob = _require3.atob,
	          btoa = _require3.btoa;
	
	      var performance = __webpack_require__(/*! ./performance.jud */ 17)(responseEnd);
	
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

/***/ },
/* 1 */
/*!****************************************************!*\
  !*** ./packages/jud-rax-framework/src/builtin.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ModuleFactories = exports.ModuleFactories = {
	  'rax': __webpack_require__(/*! rax/dist/rax.factory */ 2)
	};

/***/ },
/* 2 */
/*!******************************************!*\
  !*** ./packages/rax/dist/rax.factory.js ***!
  \******************************************/
/***/ function(module, exports) {

	module.exports = function(require, exports, module) {
	  var __jud_document__ = this["__jud_document__"];
	var document = this["document"];
	  module.exports = /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.getDriver = exports.setDriver = exports.version = exports.setNativeProps = exports.findComponentInstance = exports.unmountComponentAtNode = exports.findDOMNode = exports.render = exports.PropTypes = exports.PureComponent = exports.Component = exports.createFactory = exports.isValidElement = exports.cloneElement = exports.createElement = undefined;
		
		var _element = __webpack_require__(1);
		
		Object.defineProperty(exports, 'createElement', {
		  enumerable: true,
		  get: function get() {
		    return _element.createElement;
		  }
		});
		Object.defineProperty(exports, 'cloneElement', {
		  enumerable: true,
		  get: function get() {
		    return _element.cloneElement;
		  }
		});
		Object.defineProperty(exports, 'isValidElement', {
		  enumerable: true,
		  get: function get() {
		    return _element.isValidElement;
		  }
		});
		Object.defineProperty(exports, 'createFactory', {
		  enumerable: true,
		  get: function get() {
		    return _element.createFactory;
		  }
		});
		
		var _driver = __webpack_require__(4);
		
		Object.defineProperty(exports, 'setDriver', {
		  enumerable: true,
		  get: function get() {
		    return _driver.setDriver;
		  }
		});
		Object.defineProperty(exports, 'getDriver', {
		  enumerable: true,
		  get: function get() {
		    return _driver.getDriver;
		  }
		});
		
		__webpack_require__(11);
		
		var _component = __webpack_require__(18);
		
		var _component2 = _interopRequireDefault(_component);
		
		var _purecomponent = __webpack_require__(19);
		
		var _purecomponent2 = _interopRequireDefault(_purecomponent);
		
		var _proptypes = __webpack_require__(20);
		
		var _proptypes2 = _interopRequireDefault(_proptypes);
		
		var _render2 = __webpack_require__(21);
		
		var _render3 = _interopRequireDefault(_render2);
		
		var _findDOMNode2 = __webpack_require__(7);
		
		var _findDOMNode3 = _interopRequireDefault(_findDOMNode2);
		
		var _unmountComponentAtNode2 = __webpack_require__(14);
		
		var _unmountComponentAtNode3 = _interopRequireDefault(_unmountComponentAtNode2);
		
		var _findComponentInstance2 = __webpack_require__(33);
		
		var _findComponentInstance3 = _interopRequireDefault(_findComponentInstance2);
		
		var _setNativeProps2 = __webpack_require__(6);
		
		var _setNativeProps3 = _interopRequireDefault(_setNativeProps2);
		
		var _version2 = __webpack_require__(34);
		
		var _version3 = _interopRequireDefault(_version2);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		exports.Component = _component2.default;
		exports.PureComponent = _purecomponent2.default;
		exports.PropTypes = _proptypes2.default;
		exports.render = _render3.default;
		exports.findDOMNode = _findDOMNode3.default;
		exports.unmountComponentAtNode = _unmountComponentAtNode3.default;
		exports.findComponentInstance = _findComponentInstance3.default;
		exports.setNativeProps = _setNativeProps3.default;
		exports.version = _version3.default;
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		exports.createElement = createElement;
		exports.createFactory = createFactory;
		exports.cloneElement = cloneElement;
		exports.isValidElement = isValidElement;
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _universalEnv = __webpack_require__(3);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		var RESERVED_PROPS = {
		  key: true,
		  ref: true
		};
		
		function getRenderErrorInfo() {
		  if (_host2.default.component) {
		    var name = _host2.default.component.getName();
		    if (name) {
		      return ' Check the render method of `' + name + '`.';
		    }
		  }
		  return '';
		}
		
		var Element = function Element(type, key, ref, props, owner) {
		  props = filterProps(type, props);
		
		  return {
		    // Built-in properties that belong on the element
		    type: type,
		    key: key,
		    ref: ref,
		    props: props,
		    // Record the component responsible for creating this element.
		    _owner: owner
		  };
		};
		
		exports.default = Element;
		
		
		function traverseChildren(children, result) {
		  if (Array.isArray(children)) {
		    for (var i = 0, l = children.length; i < l; i++) {
		      traverseChildren(children[i], result);
		    }
		  } else {
		    result.push(children);
		  }
		}
		
		function flattenChildren(children) {
		  if (children == null) {
		    return children;
		  }
		  var result = [];
		  traverseChildren(children, result);
		
		  if (result.length === 1) {
		    result = result[0];
		  }
		
		  return result;
		}
		
		function flattenStyle(style) {
		  if (!style) {
		    return undefined;
		  }
		
		  if (!Array.isArray(style)) {
		    return style;
		  } else {
		    var result = {};
		    for (var i = 0; i < style.length; ++i) {
		      var computedStyle = flattenStyle(style[i]);
		      if (computedStyle) {
		        for (var key in computedStyle) {
		          result[key] = computedStyle[key];
		        }
		      }
		    }
		    return result;
		  }
		}
		
		// TODO: so hack
		function filterProps(type, props) {
		  // Only for jud text
		  if (_universalEnv.isJud && type === 'text') {
		    var value = props.children;
		    if (value) {
		      if (Array.isArray(value)) {
		        value = value.join('');
		      }
		      props.children = null;
		      props.value = value;
		    }
		  }
		  return props;
		}
		
		function createElement(type, config) {
		  if (type == null) {
		    throw Error('createElement: type should not be null or undefined.' + getRenderErrorInfo());
		  }
		  // Reserved names are extracted
		  var props = {};
		  var propName = void 0;
		  var key = null;
		  var ref = null;
		
		  if (config != null) {
		    ref = config.ref === undefined ? null : config.ref;
		    key = config.key === undefined ? null : String(config.key);
		    // Remaining properties are added to a new props object
		    for (propName in config) {
		      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
		        props[propName] = config[propName];
		      }
		    }
		  }
		
		  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		    children[_key - 2] = arguments[_key];
		  }
		
		  if (children.length) {
		    props.children = flattenChildren(children);
		  }
		
		  // Resolve default props
		  if (type && type.defaultProps) {
		    var defaultProps = type.defaultProps;
		    for (propName in defaultProps) {
		      if (props[propName] === undefined) {
		        props[propName] = defaultProps[propName];
		      }
		    }
		  }
		
		  if (props.style && (Array.isArray(props.style) || _typeof(props.style) === 'object')) {
		    props.style = flattenStyle(props.style);
		  }
		
		  return new Element(type, key, ref, props, _host2.default.component);
		}
		
		function createFactory(type) {
		  var factory = createElement.bind(null, type);
		  // Expose the type on the factory and the prototype so that it can be
		  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
		  // This should not be named `constructor` since this may not be the function
		  // that created the element, and it may not even be a constructor.
		  factory.type = type;
		  return factory;
		}
		
		function cloneElement(element, config) {
		  // Original props are copied
		  var props = Object.assign({}, element.props);
		
		  // Reserved names are extracted
		  var key = element.key;
		  var ref = element.ref;
		
		  // Owner will be preserved, unless ref is overridden
		  var owner = element._owner;
		
		  if (config) {
		    // Should reset ref and owner if has a new ref
		    if (config.ref !== undefined) {
		      ref = config.ref;
		      owner = _host2.default.component;
		    }
		
		    if (config.key !== undefined) {
		      key = String(config.key);
		    }
		
		    // Resolve default props
		    var defaultProps = void 0;
		    if (element.type && element.type.defaultProps) {
		      defaultProps = element.type.defaultProps;
		    }
		    // Remaining properties override existing props
		    var propName = void 0;
		    for (propName in config) {
		      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
		        if (config[propName] === undefined && defaultProps !== undefined) {
		          // Resolve default props
		          props[propName] = defaultProps[propName];
		        } else {
		          props[propName] = config[propName];
		        }
		      }
		    }
		  }
		
		  for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
		    children[_key2 - 2] = arguments[_key2];
		  }
		
		  if (children.length) {
		    props.children = flattenChildren(children);
		  }
		
		  return new Element(element.type, key, ref, props, owner);
		};
		
		function isValidElement(object) {
		  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.type && object.props;
		}
	
	/***/ },
	/* 2 */
	/***/ function(module, exports) {
	
		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		/*
		 * Stateful things in runtime
		 */
		exports.default = {
		  component: null,
		  driver: null,
		  mountID: 1,
		  sandbox: true,
		  // Roots
		  rootComponents: {},
		  rootInstances: {}
		};
		module.exports = exports["default"];
	
	/***/ },
	/* 3 */
	/***/ function(module, exports) {
	
		'use strict';
		
		var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
		  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
		} : function (obj) {
		  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
		};
		
		// https://www.w3.org/TR/html5/webappapis.html#dom-navigator-appcodename
		var isWeb = exports.isWeb = (typeof navigator === 'undefined' ? 'undefined' : _typeof(navigator)) === 'object' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko');
		var isNode = exports.isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
		var isJud = exports.isJud = typeof callNative === 'function';
		var isReactNative = exports.isReactNative = typeof __fbBatchedBridgeConfig !== 'undefined';
	
	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.injectDriver = exports.getDriver = exports.setDriver = undefined;
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _jud = __webpack_require__(5);
		
		var _jud2 = _interopRequireDefault(_jud);
		
		var _browser = __webpack_require__(9);
		
		var _browser2 = _interopRequireDefault(_browser);
		
		var _universalEnv = __webpack_require__(3);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		var setDriver = exports.setDriver = function setDriver(driver) {
		  _host2.default.driver = driver;
		};
		
		var getDriver = exports.getDriver = function getDriver() {
		  return _host2.default.driver;
		};
		
		var injectDriver = exports.injectDriver = function injectDriver() {
		  var driver = getDriver();
		
		  // Inject driver
		  if (!driver) {
		    if (_universalEnv.isJud) {
		      driver = _jud2.default;
		    } else if (_universalEnv.isWeb) {
		      driver = _browser2.default;
		    } else {
		      throw Error('No builtin driver matched');
		    }
		
		    setDriver(driver);
		  }
		};
	
	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
		                                                                                                                                                                                                                                                                               * Jud driver
		                                                                                                                                                                                                                                                                               **/
		
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _setNativeProps = __webpack_require__(6);
		
		var _setNativeProps2 = _interopRequireDefault(_setNativeProps);
		
		var _unit = __webpack_require__(8);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		var STYLE = 'style';
		var ID = 'id';
		var TEXT = 'text';
		var FULL_WIDTH_REM = 750;
		var DOCUMENT_FRAGMENT_NODE = 11;
		var nodeMaps = {};
		/* global __jud_document__ */
		var document = (typeof __jud_document__ === 'undefined' ? 'undefined' : _typeof(__jud_document__)) === 'object' ? __jud_document__ : (typeof document === 'undefined' ? 'undefined' : _typeof(document)) === 'object' ? document : null;
		
		var Driver = {
		  getElementById: function getElementById(id) {
		    return nodeMaps[id];
		  },
		  getChildNodes: function getChildNodes(node) {
		    return node.children;
		  },
		  createBody: function createBody() {
		    // Close batched updates
		    document.open();
		
		    if (document.body) {
		      return document.body;
		    }
		
		    var documentElement = document.documentElement;
		    var body = document.createBody();
		    documentElement.appendChild(body);
		
		    return body;
		  },
		  createFragment: function createFragment() {
		    return {
		      nodeType: DOCUMENT_FRAGMENT_NODE,
		      childNodes: []
		    };
		  },
		  createComment: function createComment(content) {
		    return document.createComment(content);
		  },
		  createEmpty: function createEmpty() {
		    return this.createComment(' empty ');
		  },
		  createText: function createText(text) {
		    return Driver.createElement({
		      type: TEXT,
		      props: {
		        value: text
		      }
		    });
		  },
		  updateText: function updateText(node, content) {
		    this.setAttribute(node, 'value', content);
		  },
		  createElement: function createElement(component) {
		    var props = component.props;
		    var events = [];
		    var style = {};
		    var originStyle = props[STYLE];
		    for (var prop in originStyle) {
		      style[prop] = (0, _unit.convertUnit)(originStyle[prop], prop);
		    }
		
		    var node = document.createElement(component.type, {
		      style: style
		    });
		
		    (0, _setNativeProps2.default)(node, props, true);
		
		    return node;
		  },
		  appendChild: function appendChild(node, parent) {
		    var _this = this;
		
		    if (parent.nodeType === DOCUMENT_FRAGMENT_NODE) {
		      return parent.childNodes.push(node);
		    } else if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
		      return node.childNodes.map(function (child) {
		        return _this.appendChild(child, parent);
		      });
		    } else {
		      return parent.appendChild(node);
		    }
		  },
		  removeChild: function removeChild(node, parent) {
		    var id = node.attr && node.attr[ID];
		    if (id != null) {
		      nodeMaps[id] = null;
		    }
		    return parent.removeChild(node);
		  },
		  replaceChild: function replaceChild(newChild, oldChild, parent) {
		    var previousSibling = oldChild.previousSibling;
		    var nextSibling = oldChild.nextSibling;
		    this.removeChild(oldChild, parent);
		
		    if (previousSibling) {
		      this.insertAfter(newChild, previousSibling, parent);
		    } else if (nextSibling) {
		      this.insertBefore(newChild, nextSibling, parent);
		    } else {
		      this.appendChild(newChild, parent);
		    }
		  },
		  insertAfter: function insertAfter(node, after, parent) {
		    var _this2 = this;
		
		    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
		      return node.childNodes.map(function (child, index) {
		        return _this2.insertAfter(child, node.childNodes[index - 1] || after, parent);
		      });
		    } else {
		      return parent.insertAfter(node, after);
		    }
		  },
		  insertBefore: function insertBefore(node, before, parent) {
		    var _this3 = this;
		
		    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
		      return node.childNodes.map(function (child, index) {
		        return _this3.insertBefore(child, before, parent);
		      });
		    } else {
		      return parent.insertBefore(node, before);
		    }
		  },
		  addEventListener: function addEventListener(node, eventName, eventHandler) {
		    return node.addEvent(eventName, eventHandler);
		  },
		  removeEventListener: function removeEventListener(node, eventName, eventHandler) {
		    return node.removeEvent(eventName, eventHandler);
		  },
		  removeAllEventListeners: function removeAllEventListeners(node) {
		    // noop
		  },
		  removeAttribute: function removeAttribute(node, propKey, propValue) {
		    if (propKey == ID) {
		      nodeMaps[propValue] = null;
		    }
		    // Jud native will crash when pass null value
		    return node.setAttr(propKey, undefined, false);
		  },
		  setAttribute: function setAttribute(node, propKey, propValue) {
		    if (propKey == ID) {
		      nodeMaps[propValue] = node;
		    }
		
		    return node.setAttr(propKey, propValue, false);
		  },
		  setStyles: function setStyles(node, styles) {
		    // TODO if more then one style update, call setStyles will be better performance
		    for (var key in styles) {
		      var val = styles[key];
		      val = (0, _unit.convertUnit)(val, key);
		      node.setStyle(key, val);
		    }
		  },
		  beforeRender: function beforeRender() {
		    // Init rem unit
		    (0, _unit.setRem)(this.getWindowWidth() / FULL_WIDTH_REM);
		  },
		  afterRender: function afterRender() {
		    if (document && document.listener && document.listener.createFinish) {
		      document.listener.createFinish(function () {
		        // Make updates batched
		        document.close();
		      });
		    }
		  },
		  getWindowWidth: function getWindowWidth() {
		    return FULL_WIDTH_REM;
		  }
		};
		
		exports.default = Driver;
		module.exports = exports['default'];
	
	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = setNativeProps;
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _findDOMNode = __webpack_require__(7);
		
		var _findDOMNode2 = _interopRequireDefault(_findDOMNode);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		var STYLE = 'style';
		var CHILDREN = 'children';
		
		function setNativeProps(node, props, disableSetStyles) {
		  node = (0, _findDOMNode2.default)(node);
		
		  for (var prop in props) {
		    var value = props[prop];
		    if (prop === CHILDREN) {
		      continue;
		    }
		
		    if (value != null) {
		      if (prop === STYLE) {
		        if (disableSetStyles) {
		          continue;
		        }
		        _host2.default.driver.setStyles(node, value);
		      } else if (prop.substring(0, 2) === 'on') {
		        var eventName = prop.slice(2).toLowerCase();
		        _host2.default.driver.addEventListener(node, eventName, value);
		      } else {
		        _host2.default.driver.setAttribute(node, prop, value);
		      }
		    }
		  }
		}
		module.exports = exports['default'];
	
	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function findDOMNode(instance) {
		  if (instance == null) {
		    return null;
		  }
		
		  // If a native node, jud may not export ownerDocument property
		  if (instance.ownerDocument || instance.nodeType) {
		    return instance;
		  }
		
		  // Native component
		  if (instance._nativeNode) {
		    return instance._nativeNode;
		  }
		
		  if (typeof instance == 'string') {
		    return _host2.default.driver.getElementById(instance);
		  }
		
		  if (typeof instance.render !== 'function') {
		    throw new Error('Appears to be neither Component nor DOMNode.');
		  }
		
		  // Composite component
		  var internal = instance._internal;
		
		  if (internal) {
		    while (!internal._nativeNode) {
		      internal = internal._renderedComponent;
		      // If not mounted
		      if (internal == null) {
		        return null;
		      }
		    }
		    return internal._nativeNode;
		  } else {
		    throw new Error('findDOMNode was called on an unmounted component.');
		  }
		}
		
		exports.default = findDOMNode;
		module.exports = exports['default'];
	
	/***/ },
	/* 8 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.isRem = isRem;
		exports.calcRem = calcRem;
		exports.getRem = getRem;
		exports.setRem = setRem;
		exports.isUnitNumber = isUnitNumber;
		exports.convertUnit = convertUnit;
		/**
		 * CSS properties which accept numbers but are not in units of "px".
		 */
		var UNITLESS_NUMBER_PROPS = {
		  animationIterationCount: true,
		  borderImageOutset: true,
		  borderImageSlice: true,
		  borderImageWidth: true,
		  boxFlex: true,
		  boxFlexGroup: true,
		  boxOrdinalGroup: true,
		  columnCount: true,
		  flex: true,
		  flexGrow: true,
		  flexPositive: true,
		  flexShrink: true,
		  flexNegative: true,
		  flexOrder: true,
		  gridRow: true,
		  gridColumn: true,
		  fontWeight: true,
		  lineClamp: true,
		  // We make lineHeight default is px that is diff with w3c spec
		  // lineHeight: true,
		  opacity: true,
		  order: true,
		  orphans: true,
		  tabSize: true,
		  widows: true,
		  zIndex: true,
		  zoom: true,
		  // Jud only
		  lines: true
		};
		var SUFFIX = 'rem';
		var REM_REG = /[-+]?\d*\.?\d+rem/g;
		
		var defaultRem = void 0;
		
		/**
		 * Is string contains rem
		 * @param {String} str
		 * @returns {Boolean}
		 */
		function isRem(str) {
		  return typeof str === 'string' && str.indexOf(SUFFIX) !== -1;
		}
		
		/**
		 * Calculate rem to pixels: '1.2rem' => 1.2 * rem
		 * @param {String} str
		 * @param {Number} rem
		 * @returns {number}
		 */
		function calcRem(str) {
		  var rem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRem;
		
		  return str.replace(REM_REG, function (remValue) {
		    return parseFloat(remValue) * rem + 'px';
		  });
		}
		
		function getRem() {
		  return defaultRem;
		}
		
		function setRem(rem) {
		  defaultRem = rem;
		}
		
		function isUnitNumber(val, prop) {
		  return typeof val === 'number' && !UNITLESS_NUMBER_PROPS[prop];
		}
		
		function convertUnit(val, prop) {
		  if (prop && isUnitNumber(val, prop)) {
		    return val * defaultRem + 'px';
		  } else if (isRem(val)) {
		    return calcRem(val);
		  }
		
		  return val;
		}
	
	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _setNativeProps = __webpack_require__(6);
		
		var _setNativeProps2 = _interopRequireDefault(_setNativeProps);
		
		var _unit = __webpack_require__(8);
		
		var _flexbox = __webpack_require__(10);
		
		var _flexbox2 = _interopRequireDefault(_flexbox);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		var FULL_WIDTH_REM = 750; /**
		                           * Web Browser driver
		                           **/
		
		var STYLE = 'style';
		var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
		var CLASS_NAME = 'className';
		var CLASS = 'class';
		
		var Driver = {
		  getElementById: function getElementById(id) {
		    return document.getElementById(id);
		  },
		  getChildNodes: function getChildNodes(node) {
		    return node.childNodes;
		  },
		  createBody: function createBody() {
		    return document.body;
		  },
		  createFragment: function createFragment() {
		    return document.createDocumentFragment();
		  },
		  createComment: function createComment(content) {
		    return document.createComment(content);
		  },
		  createEmpty: function createEmpty() {
		    return this.createComment(' empty ');
		  },
		  createText: function createText(text) {
		    return document.createTextNode(text);
		  },
		  updateText: function updateText(node, text) {
		    var textContentAttr = 'textContent' in document ? 'textContent' : 'nodeValue';
		    node[textContentAttr] = text;
		  },
		  createElement: function createElement(component) {
		    var node = document.createElement(component.type);
		    var props = component.props;
		
		    (0, _setNativeProps2.default)(node, props);
		
		    return node;
		  },
		  appendChild: function appendChild(node, parent) {
		    return parent.appendChild(node);
		  },
		  removeChild: function removeChild(node, parent) {
		    // TODO, maybe has been removed when remove child
		    if (node.parentNode === parent) {
		      parent.removeChild(node);
		    }
		  },
		  replaceChild: function replaceChild(newChild, oldChild, parent) {
		    parent.replaceChild(newChild, oldChild);
		  },
		  insertAfter: function insertAfter(node, after, parent) {
		    var nextSibling = after.nextSibling;
		    if (nextSibling) {
		      parent.insertBefore(node, nextSibling);
		    } else {
		      parent.appendChild(node);
		    }
		  },
		  insertBefore: function insertBefore(node, before, parent) {
		    parent.insertBefore(node, before);
		  },
		  addEventListener: function addEventListener(node, eventName, eventHandler) {
		    return node.addEventListener(eventName, eventHandler);
		  },
		  removeEventListener: function removeEventListener(node, eventName, eventHandler) {
		    return node.removeEventListener(eventName, eventHandler);
		  },
		  removeAllEventListeners: function removeAllEventListeners(node) {
		    // noop
		  },
		  removeAttribute: function removeAttribute(node, propKey) {
		    if (propKey === DANGEROUSLY_SET_INNER_HTML) {
		      return node.innerHTML = null;
		    }
		
		    if (propKey === CLASS_NAME) {
		      propKey = CLASS;
		    }
		
		    if (propKey in node) {
		      node[propKey] = null;
		    }
		
		    node.removeAttribute(propKey);
		  },
		  setAttribute: function setAttribute(node, propKey, propValue) {
		    if (propKey === DANGEROUSLY_SET_INNER_HTML) {
		      return node.innerHTML = propValue.__html;
		    }
		
		    if (propKey === CLASS_NAME) {
		      propKey = CLASS;
		    }
		
		    if (propKey in node) {
		      node[propKey] = propValue;
		    } else {
		      node.setAttribute(propKey, propValue);
		    }
		  },
		  setStyles: function setStyles(node, styles) {
		    for (var prop in styles) {
		      if (styles.hasOwnProperty(prop)) {
		        var val = styles[prop];
		        if (_flexbox2.default.isFlexProp(prop)) {
		          _flexbox2.default[prop](val, node.style);
		        } else {
		          node.style[prop] = (0, _unit.convertUnit)(val, prop);
		        }
		      }
		    }
		  },
		  beforeRender: function beforeRender() {
		    // Init rem unit
		    (0, _unit.setRem)(this.getWindowWidth() / FULL_WIDTH_REM);
		  },
		  getWindowWidth: function getWindowWidth() {
		    return document.documentElement.clientWidth;
		  }
		};
		
		exports.default = Driver;
		module.exports = exports['default'];
	
	/***/ },
	/* 10 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		var BOX_ALIGN = {
		  stretch: 'stretch',
		  'flex-start': 'start',
		  'flex-end': 'end',
		  center: 'center'
		};
		
		var BOX_ORIENT = {
		  row: 'horizontal',
		  column: 'vertical'
		};
		
		var BOX_PACK = {
		  'flex-start': 'start',
		  'flex-end': 'end',
		  center: 'center',
		  'space-between': 'justify',
		  'space-around': 'justify' // Just same as `space-between`
		};
		
		var FLEX_PROPS = {
		  display: true,
		  flex: true,
		  alignItems: true,
		  alignSelf: true,
		  flexDirection: true,
		  justifyContent: true,
		  flexWrap: true
		};
		
		var Flexbox = {
		  isFlexProp: function isFlexProp(prop) {
		    return FLEX_PROPS[prop];
		  },
		  display: function display(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    if (value === 'flex') {
		      style.display = '-webkit-box';
		      style.display = '-webkit-flex';
		      style.display = 'flex';
		    } else {
		      style.display = value;
		    }
		
		    return style;
		  },
		  flex: function flex(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    style.webkitBoxFlex = value;
		    style.webkitFlex = value;
		    style.flex = value;
		    return style;
		  },
		  flexWrap: function flexWrap(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    style.flexWrap = value;
		    return style;
		  },
		  alignItems: function alignItems(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    style.webkitBoxAlign = BOX_ALIGN[value];
		    style.webkitAlignItems = value;
		    style.alignItems = value;
		    return style;
		  },
		  alignSelf: function alignSelf(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    style.webkitAlignSelf = value;
		    style.alignSelf = value;
		    return style;
		  },
		  flexDirection: function flexDirection(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    style.webkitBoxOrient = BOX_ORIENT[value];
		    style.webkitFlexDirection = value;
		    style.flexDirection = value;
		    return style;
		  },
		  justifyContent: function justifyContent(value) {
		    var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		
		    style.webkitBoxPack = BOX_PACK[value];
		    style.webkitJustifyContent = value;
		    style.justifyContent = value;
		    return style;
		  }
		};
		
		exports.default = Flexbox;
		module.exports = exports['default'];
	
	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var _hook = __webpack_require__(12);
		
		var _hook2 = _interopRequireDefault(_hook);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
		  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject(_hook2.default);
		}
	
	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _instance = __webpack_require__(13);
		
		var _instance2 = _interopRequireDefault(_instance);
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		exports.default = {
		  ComponentTree: {
		    getClosestInstanceFromNode: function getClosestInstanceFromNode(node) {
		      return _instance2.default.get(node);
		    },
		    getNodeFromInstance: function getNodeFromInstance(inst) {
		      // inst is an internal instance (but could be a composite)
		      while (inst._renderedComponent) {
		        inst = inst._renderedComponent;
		      }
		
		      if (inst) {
		        return inst._nativeNode;
		      } else {
		        return null;
		      }
		    }
		  },
		  Mount: {
		    _instancesByReactRootID: _host2.default.rootComponents,
		
		    // Stub - React DevTools expects to find this method and replace it
		    // with a wrapper in order to observe new root components being added
		    _renderNewRootComponent: function _renderNewRootComponent() {}
		  },
		  Reconciler: {
		    // Stubs - React DevTools expects to find these methods and replace them
		    // with wrappers in order to observe components being mounted, updated and
		    // unmounted
		    mountComponent: function mountComponent() {},
		    receiveComponent: function receiveComponent() {},
		    unmountComponent: function unmountComponent() {}
		  }
		};
		module.exports = exports['default'];
	
	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _element = __webpack_require__(1);
		
		var _unmountComponentAtNode = __webpack_require__(14);
		
		var _unmountComponentAtNode2 = _interopRequireDefault(_unmountComponentAtNode);
		
		var _instantiateComponent = __webpack_require__(15);
		
		var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);
		
		var _shouldUpdateComponent = __webpack_require__(16);
		
		var _shouldUpdateComponent2 = _interopRequireDefault(_shouldUpdateComponent);
		
		var _root = __webpack_require__(17);
		
		var _root2 = _interopRequireDefault(_root);
		
		var _hook = __webpack_require__(12);
		
		var _hook2 = _interopRequireDefault(_hook);
		
		var _universalEnv = __webpack_require__(3);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
		
		/**
		 * Instance manager
		 */
		var KEY = '$$instance';
		
		exports.default = {
		  set: function set(node, instance) {
		    if (!node[KEY]) {
		      node[KEY] = instance;
		      // Record root instance to roots map
		      if (instance.rootID) {
		        _host2.default.rootInstances[instance.rootID] = instance;
		        _host2.default.rootComponents[instance.rootID] = instance._internal;
		      }
		    }
		  },
		  get: function get(node) {
		    return node[KEY];
		  },
		  remove: function remove(node) {
		    var instance = this.get(node);
		    if (instance) {
		      node[KEY] = null;
		      if (instance.rootID) {
		        delete _host2.default.rootComponents[instance.rootID];
		        delete _host2.default.rootInstances[instance.rootID];
		      }
		    }
		  },
		  render: function render(element, container) {
		    var prevRootInstance = this.get(container);
		    var hasPrevRootInstance = prevRootInstance && prevRootInstance.isRootComponent;
		
		    if (hasPrevRootInstance) {
		      var prevRenderedComponent = prevRootInstance.getRenderedComponent();
		      var prevElement = prevRenderedComponent._currentElement;
		      if ((0, _shouldUpdateComponent2.default)(prevElement, element)) {
		        var prevUnmaskedContext = prevRenderedComponent._context;
		        prevRenderedComponent.updateComponent(prevElement, element, prevUnmaskedContext, prevUnmaskedContext);
		
		        return prevRootInstance;
		      } else {
		        _hook2.default.Reconciler.unmountComponent(prevRootInstance);
		        (0, _unmountComponentAtNode2.default)(container);
		      }
		    }
		
		    // handle rendered ELement
		    if (_universalEnv.isWeb && container.childNodes) {
		      // clone childNodes, Because removeChild will causing change in childNodes length
		      var childNodes = [].concat(_toConsumableArray(container.childNodes));
		
		      for (var i = 0; i < childNodes.length; i++) {
		        var rootChildNode = childNodes[i];
		        if (rootChildNode.hasAttribute && rootChildNode.hasAttribute('data-rendered')) {
		          _host2.default.driver.removeChild(rootChildNode, container);
		        }
		      }
		    }
		
		    var wrappedElement = (0, _element.createElement)(_root2.default, null, element);
		    var renderedComponent = (0, _instantiateComponent2.default)(wrappedElement);
		    var defaultContext = {};
		    var rootInstance = renderedComponent.mountComponent(container, defaultContext);
		    this.set(container, rootInstance);
		    _hook2.default.Mount._renderNewRootComponent(rootInstance._internal);
		
		    return rootInstance;
		  }
		};
		module.exports = exports['default'];
	
	/***/ },
	/* 14 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = unmountComponentAtNode;
		
		var _instance = __webpack_require__(13);
		
		var _instance2 = _interopRequireDefault(_instance);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function unmountComponentAtNode(node) {
		  var component = _instance2.default.get(node);
		
		  if (!component) {
		    return false;
		  }
		
		  _instance2.default.remove(node);
		  component._internal.unmountComponent();
		
		  return true;
		};
		module.exports = exports['default'];
	
	/***/ },
	/* 15 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function instantiateComponent(element) {
		  var instance = void 0;
		
		  if (element === undefined || element === null || element === false || element === true) {
		    instance = new _host2.default.EmptyComponent();
		  } else if (Array.isArray(element)) {
		    instance = new _host2.default.FragmentComponent(element);
		  } else if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element.type) {
		    // Special case string values
		    if (typeof element.type === 'string') {
		      instance = new _host2.default.NativeComponent(element);
		    } else {
		      instance = new _host2.default.CompositeComponent(element);
		    }
		  } else if (typeof element === 'string' || typeof element === 'number') {
		    instance = new _host2.default.TextComponent(element);
		  } else {
		    throw Error('Invalid element type ' + JSON.stringify(element));
		  }
		
		  instance._mountIndex = 0;
		
		  return instance;
		}
		
		exports.default = instantiateComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 16 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		function shouldUpdateComponent(prevElement, nextElement) {
		  // TODO: prevElement and nextElement could be array
		  var prevEmpty = prevElement === null;
		  var nextEmpty = nextElement === null;
		  if (prevEmpty || nextEmpty) {
		    return prevEmpty === nextEmpty;
		  }
		
		  var prevType = typeof prevElement === 'undefined' ? 'undefined' : _typeof(prevElement);
		  var nextType = typeof nextElement === 'undefined' ? 'undefined' : _typeof(nextElement);
		  if (prevType === 'string' || prevType === 'number') {
		    return nextType === 'string' || nextType === 'number';
		  } else {
		    return prevType === 'object' && nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
		  }
		}
		
		exports.default = shouldUpdateComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _component = __webpack_require__(18);
		
		var _component2 = _interopRequireDefault(_component);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
		var rootCounter = 1;
		
		var Root = function (_Component) {
		  _inherits(Root, _Component);
		
		  function Root() {
		    var _ref;
		
		    var _temp, _this, _ret;
		
		    _classCallCheck(this, Root);
		
		    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		      args[_key] = arguments[_key];
		    }
		
		    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Root.__proto__ || Object.getPrototypeOf(Root)).call.apply(_ref, [this].concat(args))), _this), _this.rootID = rootCounter++, _temp), _possibleConstructorReturn(_this, _ret);
		  }
		
		  _createClass(Root, [{
		    key: 'isRootComponent',
		    value: function isRootComponent() {}
		  }, {
		    key: 'render',
		    value: function render() {
		      return this.props.children;
		    }
		  }, {
		    key: 'getPublicInstance',
		    value: function getPublicInstance() {
		      return this.getRenderedComponent().getPublicInstance();
		    }
		  }, {
		    key: 'getRenderedComponent',
		    value: function getRenderedComponent() {
		      return this._internal._renderedComponent;
		    }
		  }]);
		
		  return Root;
		}(_component2.default);
		
		exports.default = Root;
		module.exports = exports['default'];
	
	/***/ },
	/* 18 */
	/***/ function(module, exports) {
	
		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Base component class.
		 */
		var Component = function () {
		  function Component(props, context, updater) {
		    _classCallCheck(this, Component);
		
		    this.props = props;
		    this.context = context;
		    this.refs = {};
		    this.updater = updater;
		  }
		
		  _createClass(Component, [{
		    key: "isComponentClass",
		    value: function isComponentClass() {}
		  }, {
		    key: "setState",
		    value: function setState(partialState, callback) {
		      this.updater.setState(this, partialState, callback);
		    }
		  }, {
		    key: "forceUpdate",
		    value: function forceUpdate(callback) {
		      this.updater.forceUpdate(this, callback);
		    }
		  }]);
		
		  return Component;
		}();
		
		exports.default = Component;
		module.exports = exports["default"];
	
	/***/ },
	/* 19 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _component = __webpack_require__(18);
		
		var _component2 = _interopRequireDefault(_component);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
		/**
		 * Pure component class.
		 */
		var PureComponent = function (_Component) {
		  _inherits(PureComponent, _Component);
		
		  function PureComponent(props, context) {
		    _classCallCheck(this, PureComponent);
		
		    return _possibleConstructorReturn(this, (PureComponent.__proto__ || Object.getPrototypeOf(PureComponent)).call(this, props, context));
		  }
		
		  _createClass(PureComponent, [{
		    key: 'isPureComponentClass',
		    value: function isPureComponentClass() {}
		  }]);
		
		  return PureComponent;
		}(_component2.default);
		
		exports.default = PureComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 20 */
	/***/ function(module, exports) {
	
		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		/*
		 * Current PropTypes only export some api with react, not validate in runtime.
		 */
		
		function createChainableTypeChecker(validate) {
		  function checkType(isRequired, props, propName, componentName, location, propFullName) {
		    // Noop
		  }
		
		  var chainedCheckType = checkType.bind(null, false);
		  chainedCheckType.isRequired = checkType.bind(null, true);
		
		  return chainedCheckType;
		}
		
		function createTypeChecker(expectedType) {
		  function validate(props, propName, componentName, location, propFullName) {
		    // Noop
		  }
		  return createChainableTypeChecker(validate);
		}
		
		var typeChecker = createTypeChecker();
		
		exports.default = {
		  array: typeChecker,
		  bool: typeChecker,
		  func: typeChecker,
		  number: typeChecker,
		  object: typeChecker,
		  string: typeChecker,
		  symbol: typeChecker,
		  element: typeChecker,
		  node: typeChecker,
		  any: typeChecker,
		  arrayOf: typeChecker,
		  instanceOf: typeChecker,
		  objectOf: typeChecker,
		  oneOf: typeChecker,
		  oneOfType: typeChecker,
		  shape: typeChecker
		};
		module.exports = exports["default"];
	
	/***/ },
	/* 21 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _injectComponent = __webpack_require__(22);
		
		var _injectComponent2 = _interopRequireDefault(_injectComponent);
		
		var _instance = __webpack_require__(13);
		
		var _instance2 = _interopRequireDefault(_instance);
		
		var _unit = __webpack_require__(8);
		
		var _driver = __webpack_require__(4);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function render(element, container, callback) {
		  // Inject component
		  (0, _injectComponent2.default)();
		  // Inject driver
		  (0, _driver.injectDriver)();
		
		  var driver = (0, _driver.getDriver)();
		
		  // Before render callback
		  driver.beforeRender && driver.beforeRender(element, container);
		
		  // Real native root node is body
		  if (container == null) {
		    container = driver.createBody();
		  }
		
		  var rootComponent = _instance2.default.render(element, container);
		  var component = rootComponent.getPublicInstance();
		
		  if (callback) {
		    callback.call(component);
		  }
		  // After render callback
		  driver.afterRender && driver.afterRender(component);
		
		  return component;
		}
		
		exports.default = render;
		module.exports = exports['default'];
	
	/***/ },
	/* 22 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = injectComponent;
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _empty = __webpack_require__(23);
		
		var _empty2 = _interopRequireDefault(_empty);
		
		var _native = __webpack_require__(24);
		
		var _native2 = _interopRequireDefault(_native);
		
		var _text = __webpack_require__(27);
		
		var _text2 = _interopRequireDefault(_text);
		
		var _composite = __webpack_require__(28);
		
		var _composite2 = _interopRequireDefault(_composite);
		
		var _fragment = __webpack_require__(32);
		
		var _fragment2 = _interopRequireDefault(_fragment);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function injectComponent() {
		  // Inject component class
		  _host2.default.EmptyComponent = _empty2.default;
		  _host2.default.NativeComponent = _native2.default;
		  _host2.default.TextComponent = _text2.default;
		  _host2.default.FragmentComponent = _fragment2.default;
		  _host2.default.CompositeComponent = _composite2.default;
		}
		module.exports = exports['default'];
	
	/***/ },
	/* 23 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Empty Component
		 */
		var EmptyComponent = function () {
		  function EmptyComponent() {
		    _classCallCheck(this, EmptyComponent);
		
		    this._currentElement = null;
		  }
		
		  _createClass(EmptyComponent, [{
		    key: 'mountComponent',
		    value: function mountComponent(parent, context, childMounter) {
		      this._parent = parent;
		      this._context = context;
		
		      var instance = {
		        _internal: this
		      };
		
		      var nativeNode = this.getNativeNode();
		      if (childMounter) {
		        childMounter(nativeNode, parent);
		      } else {
		        _host2.default.driver.appendChild(nativeNode, parent);
		      }
		
		      return instance;
		    }
		  }, {
		    key: 'unmountComponent',
		    value: function unmountComponent(shouldNotRemoveChild) {
		      if (this._nativeNode && !shouldNotRemoveChild) {
		        _host2.default.driver.removeChild(this._nativeNode, this._parent);
		      }
		
		      this._nativeNode = null;
		      this._parent = null;
		      this._context = null;
		    }
		  }, {
		    key: 'updateComponent',
		    value: function updateComponent() {
		      // noop
		    }
		  }, {
		    key: 'getNativeNode',
		    value: function getNativeNode() {
		      // Jud native node
		      if (this._nativeNode == null) {
		        this._nativeNode = _host2.default.driver.createEmpty();
		      }
		
		      return this._nativeNode;
		    }
		  }]);
		
		  return EmptyComponent;
		}();
		
		exports.default = EmptyComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 24 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _ref = __webpack_require__(25);
		
		var _ref2 = _interopRequireDefault(_ref);
		
		var _instantiateComponent = __webpack_require__(15);
		
		var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);
		
		var _shouldUpdateComponent = __webpack_require__(16);
		
		var _shouldUpdateComponent2 = _interopRequireDefault(_shouldUpdateComponent);
		
		var _getElementKeyName = __webpack_require__(26);
		
		var _getElementKeyName2 = _interopRequireDefault(_getElementKeyName);
		
		var _instance = __webpack_require__(13);
		
		var _instance2 = _interopRequireDefault(_instance);
		
		var _hook = __webpack_require__(12);
		
		var _hook2 = _interopRequireDefault(_hook);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var STYLE = 'style';
		var CHILDREN = 'children';
		var TREE = 'tree';
		
		/**
		 * Native Component
		 */
		
		var NativeComponent = function () {
		  function NativeComponent(element) {
		    _classCallCheck(this, NativeComponent);
		
		    this._currentElement = element;
		  }
		
		  _createClass(NativeComponent, [{
		    key: 'mountComponent',
		    value: function mountComponent(parent, context, childMounter) {
		      // Parent native element
		      this._parent = parent;
		      this._context = context;
		      this._mountID = _host2.default.mountID++;
		
		      var props = this._currentElement.props;
		      var type = this._currentElement.type;
		      var instance = {
		        _internal: this,
		        type: type,
		        props: props
		      };
		      var appendType = props.append; // Default is node
		
		      this._instance = instance;
		
		      // Clone a copy for style diff
		      this._prevStyleCopy = Object.assign({}, props.style);
		
		      var nativeNode = this.getNativeNode();
		
		      if (appendType !== TREE) {
		        if (childMounter) {
		          childMounter(nativeNode, parent);
		        } else {
		          _host2.default.driver.appendChild(nativeNode, parent);
		        }
		      }
		
		      if (this._currentElement && this._currentElement.ref) {
		        _ref2.default.attach(this._currentElement._owner, this._currentElement.ref, this);
		      }
		
		      // Process children
		      var children = props.children;
		      if (children != null) {
		        this.mountChildren(children, context);
		      }
		
		      if (appendType === TREE) {
		        if (childMounter) {
		          childMounter(nativeNode, parent);
		        } else {
		          _host2.default.driver.appendChild(nativeNode, parent);
		        }
		      }
		
		      _hook2.default.Reconciler.mountComponent(this);
		
		      return instance;
		    }
		  }, {
		    key: 'mountChildren',
		    value: function mountChildren(children, context) {
		      var _this = this;
		
		      if (!Array.isArray(children)) {
		        children = [children];
		      }
		
		      var renderedChildren = {};
		
		      var renderedChildrenImage = children.map(function (element, index) {
		        var renderedChild = (0, _instantiateComponent2.default)(element);
		        var name = (0, _getElementKeyName2.default)(renderedChildren, element, index);
		        renderedChildren[name] = renderedChild;
		        renderedChild._mountIndex = index;
		        // Mount
		        var mountImage = renderedChild.mountComponent(_this.getNativeNode(), context);
		        return mountImage;
		      });
		
		      this._renderedChildren = renderedChildren;
		
		      return renderedChildrenImage;
		    }
		  }, {
		    key: 'unmountChildren',
		    value: function unmountChildren() {
		      var renderedChildren = this._renderedChildren;
		
		      if (renderedChildren) {
		        for (var name in renderedChildren) {
		          var renderedChild = renderedChildren[name];
		          renderedChild.unmountComponent();
		        }
		        this._renderedChildren = null;
		      }
		    }
		  }, {
		    key: 'unmountComponent',
		    value: function unmountComponent(shouldNotRemoveChild) {
		      if (this._nativeNode) {
		        var ref = this._currentElement.ref;
		        if (ref) {
		          _ref2.default.detach(this._currentElement._owner, ref, this);
		        }
		
		        _instance2.default.remove(this._nativeNode);
		        if (!shouldNotRemoveChild) {
		          _host2.default.driver.removeChild(this._nativeNode, this._parent);
		        }
		        _host2.default.driver.removeAllEventListeners(this._nativeNode);
		      }
		
		      this.unmountChildren();
		
		      _hook2.default.Reconciler.unmountComponent(this);
		
		      this._currentElement = null;
		      this._nativeNode = null;
		      this._parent = null;
		      this._context = null;
		      this._instance = null;
		      this._prevStyleCopy = null;
		    }
		  }, {
		    key: 'updateComponent',
		    value: function updateComponent(prevElement, nextElement, prevContext, nextContext) {
		      // Replace current element
		      this._currentElement = nextElement;
		
		      _ref2.default.update(prevElement, nextElement, this);
		
		      var prevProps = prevElement.props;
		      var nextProps = nextElement.props;
		
		      this.updateProperties(prevProps, nextProps);
		      this.updateChildren(nextProps.children, nextContext);
		
		      _hook2.default.Reconciler.receiveComponent(this);
		    }
		  }, {
		    key: 'updateProperties',
		    value: function updateProperties(prevProps, nextProps) {
		      var propKey = void 0;
		      var styleName = void 0;
		      var styleUpdates = void 0;
		      for (propKey in prevProps) {
		        if (propKey === CHILDREN || nextProps.hasOwnProperty(propKey) || !prevProps.hasOwnProperty(propKey) || prevProps[propKey] == null) {
		          continue;
		        }
		        if (propKey === STYLE) {
		          var lastStyle = this._prevStyleCopy;
		          for (styleName in lastStyle) {
		            if (lastStyle.hasOwnProperty(styleName)) {
		              styleUpdates = styleUpdates || {};
		              styleUpdates[styleName] = '';
		            }
		          }
		          this._prevStyleCopy = null;
		        } else if (propKey.substring(0, 2) === 'on') {
		          if (prevProps[propKey]) {
		            _host2.default.driver.removeEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), prevProps[propKey]);
		          }
		        } else {
		          _host2.default.driver.removeAttribute(this.getNativeNode(), propKey, prevProps[propKey]);
		        }
		      }
		
		      for (propKey in nextProps) {
		        var nextProp = nextProps[propKey];
		        var prevProp = propKey === STYLE ? this._prevStyleCopy : prevProps != null ? prevProps[propKey] : undefined;
		        if (propKey === CHILDREN || !nextProps.hasOwnProperty(propKey) || nextProp === prevProp || nextProp == null && prevProp == null) {
		          continue;
		        }
		        // Update style
		        if (propKey === STYLE) {
		          if (nextProp) {
		            // Clone property
		            nextProp = this._prevStyleCopy = Object.assign({}, nextProp);
		          } else {
		            this._prevStyleCopy = null;
		          }
		
		          if (prevProp != null) {
		            // Unset styles on `prevProp` but not on `nextProp`.
		            for (styleName in prevProp) {
		              if (prevProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
		                styleUpdates = styleUpdates || {};
		                styleUpdates[styleName] = '';
		              }
		            }
		            // Update styles that changed since `prevProp`.
		            for (styleName in nextProp) {
		              if (nextProp.hasOwnProperty(styleName) && prevProp[styleName] !== nextProp[styleName]) {
		                styleUpdates = styleUpdates || {};
		                styleUpdates[styleName] = nextProp[styleName];
		              }
		            }
		          } else {
		            // Assign next prop when prev style is null
		            styleUpdates = nextProp;
		          }
		
		          // Update event binding
		        } else if (propKey.substring(0, 2) === 'on') {
		          if (prevProp != null) {
		            _host2.default.driver.removeEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), prevProp);
		          }
		
		          if (nextProp != null) {
		            _host2.default.driver.addEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), nextProp);
		          }
		          // Update other property
		        } else {
		          if (nextProp != null) {
		            _host2.default.driver.setAttribute(this.getNativeNode(), propKey, nextProp);
		          } else {
		            _host2.default.driver.removeAttribute(this.getNativeNode(), propKey, prevProps[propKey]);
		          }
		        }
		      }
		
		      if (styleUpdates) {
		        _host2.default.driver.setStyles(this.getNativeNode(), styleUpdates);
		      }
		    }
		  }, {
		    key: 'updateChildren',
		    value: function updateChildren(nextChildrenElements, context) {
		      var _this2 = this;
		
		      // prev rendered children
		      var prevChildren = this._renderedChildren;
		
		      if (nextChildrenElements == null && prevChildren == null) {
		        return;
		      }
		
		      var nextChildren = {};
		      var oldNodes = {};
		
		      if (nextChildrenElements != null) {
		        if (!Array.isArray(nextChildrenElements)) {
		          nextChildrenElements = [nextChildrenElements];
		        }
		
		        // Update next children elements
		        for (var index = 0, length = nextChildrenElements.length; index < length; index++) {
		          var nextElement = nextChildrenElements[index];
		          var name = (0, _getElementKeyName2.default)(nextChildren, nextElement, index);
		          var prevChild = prevChildren && prevChildren[name];
		          var prevElement = prevChild && prevChild._currentElement;
		
		          if (prevChild != null && (0, _shouldUpdateComponent2.default)(prevElement, nextElement)) {
		            // Pass the same context when updating chidren
		            prevChild.updateComponent(prevElement, nextElement, context, context);
		            nextChildren[name] = prevChild;
		          } else {
		            // Unmount the prevChild when nextChild is different element type.
		            if (prevChild) {
		              var oldChild = prevChild.getNativeNode();
		              // Delay remove child
		              prevChild.unmountComponent(true);
		              oldNodes[name] = oldChild;
		            }
		            // The child must be instantiated before it's mounted.
		            nextChildren[name] = (0, _instantiateComponent2.default)(nextElement);
		          }
		        }
		      }
		
		      // Unmount children that are no longer present.
		      if (prevChildren != null) {
		        for (var _name in prevChildren) {
		          if (!prevChildren.hasOwnProperty(_name)) {
		            continue;
		          }
		          var _prevChild = prevChildren[_name];
		          if (!nextChildren[_name]) {
		            _prevChild.unmountComponent();
		          }
		        }
		      }
		
		      if (nextChildren != null) {
		        (function () {
		          // `nextIndex` will increment for each child in `nextChildren`, but
		          // `lastIndex` will be the last index visited in `prevChildren`.
		          var lastIndex = 0;
		          var nextIndex = 0;
		          var lastPlacedNode = null;
		
		          var _loop = function _loop(_name2) {
		            if (!nextChildren.hasOwnProperty(_name2)) {
		              return 'continue';
		            }
		
		            var nextChild = nextChildren[_name2];
		            var prevChild = prevChildren && prevChildren[_name2];
		
		            if (prevChild === nextChild) {
		              // If the index of `child` is less than `lastIndex`, then it needs to
		              // be moved. Otherwise, we do not need to move it because a child will be
		              // inserted or moved before `child`.
		              if (prevChild._mountIndex < lastIndex) {
		                _host2.default.driver.insertAfter(prevChild.getNativeNode(), lastPlacedNode, _this2.getNativeNode());
		              }
		
		              lastIndex = Math.max(prevChild._mountIndex, lastIndex);
		              prevChild._mountIndex = nextIndex;
		            } else {
		              if (prevChild != null) {
		                // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
		                lastIndex = Math.max(prevChild._mountIndex, lastIndex);
		              }
		
		              nextChild.mountComponent(_this2.getNativeNode(), context, function (newChild, parent) {
		                var oldChild = oldNodes[_name2];
		                if (oldChild) {
		                  _host2.default.driver.replaceChild(newChild, oldChild, parent);
		                } else {
		                  // insert child at a specific index
		                  var childNodes = _host2.default.driver.getChildNodes(parent);
		                  var currentNode = childNodes[nextIndex];
		                  if (currentNode) {
		                    _host2.default.driver.insertBefore(newChild, currentNode, parent);
		                  } else {
		                    _host2.default.driver.appendChild(newChild, parent);
		                  }
		                }
		              });
		              nextChild._mountIndex = nextIndex;
		            }
		
		            nextIndex++;
		            lastPlacedNode = nextChild.getNativeNode();
		          };
		
		          for (var _name2 in nextChildren) {
		            var _ret2 = _loop(_name2);
		
		            if (_ret2 === 'continue') continue;
		          }
		        })();
		      }
		
		      this._renderedChildren = nextChildren;
		    }
		  }, {
		    key: 'getNativeNode',
		    value: function getNativeNode() {
		      if (this._nativeNode == null) {
		        this._nativeNode = _host2.default.driver.createElement(this._instance);
		        _instance2.default.set(this._nativeNode, this._instance);
		      }
		
		      return this._nativeNode;
		    }
		  }, {
		    key: 'getPublicInstance',
		    value: function getPublicInstance() {
		      return this.getNativeNode();
		    }
		  }, {
		    key: 'getName',
		    value: function getName() {
		      return this._currentElement.type;
		    }
		  }]);
		
		  return NativeComponent;
		}();
		
		exports.default = NativeComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 25 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		/*
		 * Ref manager
		 */
		
		exports.default = {
		  update: function update(prevElement, nextElement, component) {
		    var prevRef = prevElement != null && prevElement.ref;
		    var nextRef = nextElement != null && nextElement.ref;
		
		    // Update refs in owner component
		    if (prevRef !== nextRef) {
		      // Detach prev RenderedElement's ref
		      prevRef != null && this.detach(prevElement._owner, prevRef, component);
		      // Attach next RenderedElement's ref
		      nextRef != null && this.attach(nextElement._owner, nextRef, component);
		    }
		  },
		  attach: function attach(ownerComponent, ref, component) {
		    if (!ownerComponent) {
		      throw new Error('You might be adding a ref to a component that was not created inside a component\'s ' + '`render` method, or you have multiple copies of Rax loaded.');
		    }
		
		    var instance = component.getPublicInstance();
		    if (typeof ref === 'function') {
		      ref(instance);
		    } else {
		      ownerComponent._instance.refs[ref] = instance;
		    }
		  },
		  detach: function detach(ownerComponent, ref, component) {
		    if (typeof ref === 'function') {
		      // When the referenced component is unmounted and whenever the ref changes, the old ref will be called with null as an argument.
		      ref(null);
		    } else {
		      // Must match component and ref could detach the ref on owner when A's before ref is B's current ref
		      var instance = component.getPublicInstance();
		      if (ownerComponent._instance.refs[ref] === instance) {
		        delete ownerComponent._instance.refs[ref];
		      }
		    }
		  }
		};
		module.exports = exports['default'];
	
	/***/ },
	/* 26 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		exports.default = function (children, element, index) {
		  var elementKey = element && element.key;
		  var hasKey = typeof elementKey === 'string';
		  var defaultName = '.' + index.toString(36);
		
		  if (hasKey) {
		    var keyName = '$' + elementKey;
		    // Child keys must be unique.
		    var keyUnique = children[keyName] === undefined;
		    // Only the first child will be used when encountered two children with the same key
		    if (!keyUnique) console.warn('Encountered two children with the same key "' + elementKey + '".');
		
		    return keyUnique ? keyName : defaultName;
		  } else {
		    return defaultName;
		  }
		};
		
		module.exports = exports['default'];
	
	/***/ },
	/* 27 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _hook = __webpack_require__(12);
		
		var _hook2 = _interopRequireDefault(_hook);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Text Component
		 */
		var TextComponent = function () {
		  function TextComponent(element) {
		    _classCallCheck(this, TextComponent);
		
		    this._currentElement = element;
		    this._stringText = String(element);
		  }
		
		  _createClass(TextComponent, [{
		    key: 'mountComponent',
		    value: function mountComponent(parent, context, childMounter) {
		      this._parent = parent;
		      this._context = context;
		      this._mountID = _host2.default.mountID++;
		
		      // Jud dom operation
		      var nativeNode = this.getNativeNode();
		
		      if (childMounter) {
		        childMounter(nativeNode, parent);
		      } else {
		        _host2.default.driver.appendChild(nativeNode, parent);
		      }
		
		      var instance = {
		        _internal: this
		      };
		
		      _hook2.default.Reconciler.mountComponent(this);
		
		      return instance;
		    }
		  }, {
		    key: 'unmountComponent',
		    value: function unmountComponent(shouldNotRemoveChild) {
		      if (this._nativeNode && !shouldNotRemoveChild) {
		        _host2.default.driver.removeChild(this._nativeNode, this._parent);
		      }
		
		      _hook2.default.Reconciler.unmountComponent(this);
		
		      this._currentElement = null;
		      this._nativeNode = null;
		      this._parent = null;
		      this._context = null;
		      this._stringText = null;
		    }
		  }, {
		    key: 'updateComponent',
		    value: function updateComponent(prevElement, nextElement, context) {
		      // If some text do noting
		      if (prevElement !== nextElement) {
		        // Replace current element
		        this._currentElement = nextElement;
		        // Devtool read the latest stringText value
		        this._stringText = String(nextElement);
		        _host2.default.driver.updateText(this.getNativeNode(), nextElement);
		        _hook2.default.Reconciler.receiveComponent(this);
		      }
		    }
		  }, {
		    key: 'getNativeNode',
		    value: function getNativeNode() {
		      if (this._nativeNode == null) {
		        this._nativeNode = _host2.default.driver.createText(this._stringText);
		      }
		      return this._nativeNode;
		    }
		  }]);
		
		  return TextComponent;
		}();
		
		exports.default = TextComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 28 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _stateless = __webpack_require__(29);
		
		var _stateless2 = _interopRequireDefault(_stateless);
		
		var _updater = __webpack_require__(30);
		
		var _updater2 = _interopRequireDefault(_updater);
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _ref = __webpack_require__(25);
		
		var _ref2 = _interopRequireDefault(_ref);
		
		var _instantiateComponent = __webpack_require__(15);
		
		var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);
		
		var _shouldUpdateComponent = __webpack_require__(16);
		
		var _shouldUpdateComponent2 = _interopRequireDefault(_shouldUpdateComponent);
		
		var _shallowEqual = __webpack_require__(31);
		
		var _shallowEqual2 = _interopRequireDefault(_shallowEqual);
		
		var _hook = __webpack_require__(12);
		
		var _hook2 = _interopRequireDefault(_hook);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function performInSandbox(fn, handleError) {
		  try {
		    return fn();
		  } catch (e) {
		    if (handleError) {
		      handleError(e);
		    } else {
		      if (_host2.default.sandbox) {
		        setTimeout(function () {
		          throw e;
		        }, 0);
		      } else {
		        throw e;
		      }
		    }
		  }
		}
		
		/**
		 * Composite Component
		 */
		
		var CompositeComponent = function () {
		  function CompositeComponent(element) {
		    _classCallCheck(this, CompositeComponent);
		
		    this._currentElement = element;
		  }
		
		  _createClass(CompositeComponent, [{
		    key: 'getName',
		    value: function getName() {
		      var type = this._currentElement.type;
		      var constructor = this._instance && this._instance.constructor;
		      return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
		    }
		  }, {
		    key: 'mountComponent',
		    value: function mountComponent(parent, context, childMounter) {
		      this._parent = parent;
		      this._context = context;
		      this._mountID = _host2.default.mountID++;
		      this._updateCount = 0;
		
		      var Component = this._currentElement.type;
		      var publicProps = this._currentElement.props;
		      var isClass = Component.prototype;
		      var isComponentClass = isClass && Component.prototype.isComponentClass;
		      // Class stateless component without state but have lifecycles
		      var isStatelessClass = isClass && Component.prototype.render;
		
		      // Context process
		      var publicContext = this._processContext(context);
		
		      // Initialize the public class
		      var instance = void 0;
		      var renderedElement = void 0;
		
		      if (isComponentClass || isStatelessClass) {
		        // Component instance
		        instance = new Component(publicProps, publicContext, _updater2.default);
		      } else if (typeof Component === 'function') {
		        // Functional stateless component without state and lifecycles
		        instance = new _stateless2.default(Component);
		      } else {
		        throw Error('Invalid component type ' + JSON.stringify(Component));
		      }
		
		      // These should be set up in the constructor, but as a convenience for
		      // simpler class abstractions, we set them up after the fact.
		      instance.props = publicProps;
		      instance.context = publicContext;
		      instance.refs = {};
		
		      // Inject the updater into instance
		      instance.updater = _updater2.default;
		      instance._internal = this;
		      this._instance = instance;
		
		      // Init state, must be set to an object or null
		      var initialState = instance.state;
		      if (initialState === undefined) {
		        // TODO clone the state?
		        instance.state = initialState = null;
		      }
		
		      performInSandbox(function () {
		        if (instance.componentWillMount) {
		          instance.componentWillMount();
		        }
		      });
		
		      if (renderedElement == null) {
		        _host2.default.component = this;
		        // Process pending state when call setState in componentWillMount
		        instance.state = this._processPendingState(publicProps, publicContext);
		
		        // FIXME: handleError should named as lifecycles
		        var handleError = void 0;
		        if (typeof instance.handleError === 'function') {
		          handleError = function handleError(e) {
		            instance.handleError(e);
		          };
		        }
		
		        performInSandbox(function () {
		          renderedElement = instance.render();
		        }, handleError);
		
		        _host2.default.component = null;
		      }
		
		      this._renderedComponent = (0, _instantiateComponent2.default)(renderedElement);
		      this._renderedComponent.mountComponent(this._parent, this._processChildContext(context), childMounter);
		
		      if (this._currentElement && this._currentElement.ref) {
		        _ref2.default.attach(this._currentElement._owner, this._currentElement.ref, this);
		      }
		
		      performInSandbox(function () {
		        if (instance.componentDidMount) {
		          instance.componentDidMount();
		        }
		      });
		
		      _hook2.default.Reconciler.mountComponent(this);
		
		      return instance;
		    }
		  }, {
		    key: 'unmountComponent',
		    value: function unmountComponent(shouldNotRemoveChild) {
		      var instance = this._instance;
		
		      performInSandbox(function () {
		        if (instance.componentWillUnmount) {
		          instance.componentWillUnmount();
		        }
		      });
		
		      _hook2.default.Reconciler.unmountComponent(this);
		
		      instance._internal = null;
		
		      if (this._renderedComponent != null) {
		        var ref = this._currentElement.ref;
		        if (ref) {
		          _ref2.default.detach(this._currentElement._owner, ref, this);
		        }
		
		        this._renderedComponent.unmountComponent(shouldNotRemoveChild);
		        this._renderedComponent = null;
		        this._instance = null;
		      }
		
		      this._currentElement = null;
		
		      // Reset pending fields
		      // Even if this component is scheduled for another update in ReactUpdates,
		      // it would still be ignored because these fields are reset.
		      this._pendingStateQueue = null;
		      this._pendingForceUpdate = false;
		
		      // These fields do not really need to be reset since this object is no
		      // longer accessible.
		      this._context = null;
		    }
		
		    /**
		     * Filters the context object to only contain keys specified in
		     * `contextTypes`
		     */
		
		  }, {
		    key: '_processContext',
		    value: function _processContext(context) {
		      var Component = this._currentElement.type;
		      var contextTypes = Component.contextTypes;
		      if (!contextTypes) {
		        return {};
		      }
		      var maskedContext = {};
		      for (var contextName in contextTypes) {
		        maskedContext[contextName] = context[contextName];
		      }
		      return maskedContext;
		    }
		  }, {
		    key: '_processChildContext',
		    value: function _processChildContext(currentContext) {
		      var instance = this._instance;
		      var childContext = instance.getChildContext && instance.getChildContext();
		      if (childContext) {
		        return Object.assign({}, currentContext, childContext);
		      }
		      return currentContext;
		    }
		  }, {
		    key: '_processPendingState',
		    value: function _processPendingState(props, context) {
		      var instance = this._instance;
		      var queue = this._pendingStateQueue;
		      if (!queue) {
		        return instance.state;
		      }
		      // Reset pending queue
		      this._pendingStateQueue = null;
		      var nextState = Object.assign({}, instance.state);
		      for (var i = 0; i < queue.length; i++) {
		        var partial = queue[i];
		        Object.assign(nextState, typeof partial === 'function' ? partial.call(instance, nextState, props, context) : partial);
		      }
		
		      return nextState;
		    }
		  }, {
		    key: 'updateComponent',
		    value: function updateComponent(prevElement, nextElement, prevUnmaskedContext, nextUnmaskedContext) {
		      var _this = this;
		
		      var instance = this._instance;
		
		      if (!instance) {
		        console.error('Update component \'' + this.getName() + '\' that has already been unmounted (or failed to mount).');
		      }
		
		      var willReceive = false;
		      var nextContext = void 0;
		      var nextProps = void 0;
		
		      // Determine if the context has changed or not
		      if (this._context === nextUnmaskedContext) {
		        nextContext = instance.context;
		      } else {
		        nextContext = this._processContext(nextUnmaskedContext);
		        willReceive = true;
		      }
		
		      // Distinguish between a props update versus a simple state update
		      if (prevElement === nextElement) {
		        // Skip checking prop types again -- we don't read component.props to avoid
		        // warning for DOM component props in this upgrade
		        nextProps = nextElement.props;
		      } else {
		        nextProps = nextElement.props;
		        willReceive = true;
		      }
		
		      if (willReceive && instance.componentWillReceiveProps) {
		        // Calling this.setState() within componentWillReceiveProps will not trigger an additional render.
		        this._pendingState = true;
		        performInSandbox(function () {
		          instance.componentWillReceiveProps(nextProps, nextContext);
		        });
		        this._pendingState = false;
		      }
		
		      // Update refs
		      _ref2.default.update(prevElement, nextElement, this);
		
		      // Shoud update always default
		      var shouldUpdate = true;
		      var prevProps = instance.props;
		      var prevState = instance.state;
		      // TODO: could delay execution processPendingState
		      var nextState = this._processPendingState(nextProps, nextContext);
		
		      // ShouldComponentUpdate is not called when forceUpdate is used
		      if (!this._pendingForceUpdate) {
		        if (instance.shouldComponentUpdate) {
		          shouldUpdate = performInSandbox(function () {
		            return instance.shouldComponentUpdate(nextProps, nextState, nextContext);
		          });
		        } else if (instance.isPureComponentClass) {
		          shouldUpdate = !(0, _shallowEqual2.default)(prevProps, nextProps) || !(0, _shallowEqual2.default)(prevState, nextState);
		        }
		      }
		
		      if (shouldUpdate) {
		        (function () {
		          _this._pendingForceUpdate = false;
		          // Will set `this.props`, `this.state` and `this.context`.
		          var prevContext = instance.context;
		
		          // Cannot use this.setState() in componentWillUpdate.
		          // If need to update state in response to a prop change, use componentWillReceiveProps instead.
		          performInSandbox(function () {
		            if (instance.componentWillUpdate) {
		              instance.componentWillUpdate(nextProps, nextState, nextContext);
		            }
		          });
		
		          // Replace with next
		          _this._currentElement = nextElement;
		          _this._context = nextUnmaskedContext;
		          instance.props = nextProps;
		          instance.state = nextState;
		          instance.context = nextContext;
		
		          _this._updateRenderedComponent(nextUnmaskedContext);
		
		          performInSandbox(function () {
		            if (instance.componentDidUpdate) {
		              instance.componentDidUpdate(prevProps, prevState, prevContext);
		            }
		          });
		
		          _this._updateCount++;
		        })();
		      } else {
		        // If it's determined that a component should not update, we still want
		        // to set props and state but we shortcut the rest of the update.
		        this._currentElement = nextElement;
		        this._context = nextUnmaskedContext;
		        instance.props = nextProps;
		        instance.state = nextState;
		        instance.context = nextContext;
		      }
		
		      _hook2.default.Reconciler.receiveComponent(this);
		    }
		
		    /**
		     * Call the component's `render` method and update the DOM accordingly.
		     */
		
		  }, {
		    key: '_updateRenderedComponent',
		    value: function _updateRenderedComponent(context) {
		      var _this2 = this;
		
		      var prevRenderedComponent = this._renderedComponent;
		      var prevRenderedElement = prevRenderedComponent._currentElement;
		
		      var instance = this._instance;
		      var nextRenderedElement = void 0;
		
		      _host2.default.component = this;
		
		      performInSandbox(function () {
		        nextRenderedElement = instance.render();
		      });
		
		      _host2.default.component = null;
		
		      if ((0, _shouldUpdateComponent2.default)(prevRenderedElement, nextRenderedElement)) {
		        prevRenderedComponent.updateComponent(prevRenderedElement, nextRenderedElement, prevRenderedComponent._context, this._processChildContext(context));
		      } else {
		        (function () {
		          var oldChild = prevRenderedComponent.getNativeNode();
		          prevRenderedComponent.unmountComponent(true);
		
		          _this2._renderedComponent = (0, _instantiateComponent2.default)(nextRenderedElement);
		          _this2._renderedComponent.mountComponent(_this2._parent, _this2._processChildContext(context), function (newChild, parent) {
		            _host2.default.driver.replaceChild(newChild, oldChild, parent);
		          });
		        })();
		      }
		    }
		  }, {
		    key: 'getNativeNode',
		    value: function getNativeNode() {
		      var renderedComponent = this._renderedComponent;
		      if (renderedComponent) {
		        return renderedComponent.getNativeNode();
		      }
		    }
		  }, {
		    key: 'getPublicInstance',
		    value: function getPublicInstance() {
		      var instance = this._instance;
		      // The Stateless components cannot be given refs
		      if (instance instanceof _stateless2.default) {
		        return null;
		      }
		      return instance;
		    }
		  }]);
		
		  return CompositeComponent;
		}();
		
		exports.default = CompositeComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 29 */
	/***/ function(module, exports) {
	
		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Stateless Component Class Wrapper
		 */
		var StatelessComponent = function () {
		  function StatelessComponent(pureRender) {
		    _classCallCheck(this, StatelessComponent);
		
		    // A stateless class
		
		    // A stateless function
		    this.pureRender = pureRender;
		  }
		
		  _createClass(StatelessComponent, [{
		    key: "render",
		    value: function render() {
		      return this.pureRender(this.props, this.context);
		    }
		  }]);
		
		  return StatelessComponent;
		}();
		
		exports.default = StatelessComponent;
		module.exports = exports["default"];
	
	/***/ },
	/* 30 */
	/***/ function(module, exports) {
	
		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		function enqueueCallback(internal, callback) {
		  if (callback) {
		    var callbackQueue = internal._pendingCallbacks || (internal._pendingCallbacks = []);
		    callbackQueue.push(callback);
		  }
		}
		
		function enqueueState(internal, partialState) {
		  if (partialState) {
		    var stateQueue = internal._pendingStateQueue || (internal._pendingStateQueue = []);
		    stateQueue.push(partialState);
		  }
		}
		
		var Updater = {
		  setState: function setState(component, partialState, callback) {
		    var internal = component._internal;
		
		    if (!internal) {
		      return;
		    }
		
		    enqueueState(internal, partialState);
		    enqueueCallback(internal, callback);
		
		    if (!internal._pendingState) {
		      this.runUpdate(component);
		    }
		  },
		
		  forceUpdate: function forceUpdate(component, callback) {
		    var internal = component._internal;
		
		    if (!internal) {
		      return;
		    }
		
		    internal._pendingForceUpdate = true;
		
		    enqueueCallback(internal, callback);
		    this.runUpdate(component);
		  },
		
		  runUpdate: function runUpdate(component) {
		    var internal = component._internal;
		
		    if (!internal || !internal._renderedComponent) {
		      return;
		    }
		
		    // If updateComponent happens to enqueue any new updates, we
		    // shouldn't execute the callbacks until the next render happens, so
		    // stash the callbacks first
		    var callbacks = internal._pendingCallbacks;
		    internal._pendingCallbacks = null;
		
		    var prevElement = internal._currentElement;
		    var prevUnmaskedContext = internal._context;
		
		    if (internal._pendingStateQueue || internal._pendingForceUpdate) {
		      internal.updateComponent(prevElement, prevElement, prevUnmaskedContext, prevUnmaskedContext);
		    }
		
		    if (callbacks) {
		      callbacks.forEach(function (callback) {
		        return callback();
		      });
		    }
		  }
		
		};
		
		exports.default = Updater;
		module.exports = exports["default"];
	
	/***/ },
	/* 31 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		
		/**
		 * inlined Object.is polyfill to avoid requiring consumers ship their own
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
		 */
		function is(x, y) {
		  // SameValue algorithm
		  if (x === y) {
		    // Steps 1-5, 7-10
		    // Steps 6.b-6.e: +0 != -0
		    return x !== 0 || 1 / x === 1 / y;
		  } else {
		    // Step 6.a: NaN == NaN
		    return x !== x && y !== y;
		  }
		}
		
		/**
		 * Performs equality by iterating through keys on an object and returning false
		 * when any key has values which are not strictly equal between the arguments.
		 * Returns true when the values of all keys are strictly equal.
		 */
		function shallowEqual(objA, objB) {
		  if (is(objA, objB)) {
		    return true;
		  }
		
		  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
		    return false;
		  }
		
		  var keysA = Object.keys(objA);
		  var keysB = Object.keys(objB);
		
		  if (keysA.length !== keysB.length) {
		    return false;
		  }
		
		  // Test for A's keys different from B.
		  for (var i = 0; i < keysA.length; i++) {
		    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
		      return false;
		    }
		  }
		
		  return true;
		}
		
		exports.default = shallowEqual;
		module.exports = exports['default'];
	
	/***/ },
	/* 32 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		var _host = __webpack_require__(2);
		
		var _host2 = _interopRequireDefault(_host);
		
		var _native = __webpack_require__(24);
		
		var _native2 = _interopRequireDefault(_native);
		
		var _instance = __webpack_require__(13);
		
		var _instance2 = _interopRequireDefault(_instance);
		
		var _instantiateComponent = __webpack_require__(15);
		
		var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);
		
		var _getElementKeyName = __webpack_require__(26);
		
		var _getElementKeyName2 = _interopRequireDefault(_getElementKeyName);
		
		var _hook = __webpack_require__(12);
		
		var _hook2 = _interopRequireDefault(_hook);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
		
		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
		/**
		 * Fragment Component
		 */
		var FragmentComponent = function (_NativeComponent) {
		  _inherits(FragmentComponent, _NativeComponent);
		
		  function FragmentComponent(element) {
		    _classCallCheck(this, FragmentComponent);
		
		    return _possibleConstructorReturn(this, (FragmentComponent.__proto__ || Object.getPrototypeOf(FragmentComponent)).call(this, element));
		  }
		
		  _createClass(FragmentComponent, [{
		    key: 'mountComponent',
		    value: function mountComponent(parent, context, childMounter) {
		      // Parent native element
		      this._parent = parent;
		      this._context = context;
		      this._mountID = _host2.default.mountID++;
		
		      var instance = {
		        _internal: this
		      };
		      this._instance = instance;
		
		      var nativeNode = this.getNativeNode();
		      var children = this._currentElement;
		
		      // Process children
		      this.mountChildren(children, context);
		
		      // Fragment child nodes append by tree mode
		      if (childMounter) {
		        childMounter(nativeNode, parent);
		      } else {
		        _host2.default.driver.appendChild(nativeNode, parent);
		      }
		
		      // set to right node when append to parent
		      this._nativeNode = parent;
		
		      _hook2.default.Reconciler.mountComponent(this);
		
		      return instance;
		    }
		  }, {
		    key: 'mountChildren',
		    value: function mountChildren(children, context) {
		      var _this2 = this;
		
		      var renderedChildren = {};
		      var fragment = this.getNativeNode();
		
		      var renderedChildrenImage = children.map(function (element, index) {
		        var renderedChild = (0, _instantiateComponent2.default)(element);
		        var name = (0, _getElementKeyName2.default)(renderedChildren, element, index);
		        renderedChildren[name] = renderedChild;
		        renderedChild._mountIndex = index;
		        // Mount
		        var mountImage = renderedChild.mountComponent(_this2._parent, context, function (nativeNode) {
		          _host2.default.driver.appendChild(nativeNode, fragment);
		        });
		        return mountImage;
		      });
		
		      this._renderedChildren = renderedChildren;
		
		      return renderedChildrenImage;
		    }
		  }, {
		    key: 'unmountComponent',
		    value: function unmountComponent(shouldNotRemoveChild) {
		      if (this._nativeNode) {
		        _instance2.default.remove(this._nativeNode);
		        if (!shouldNotRemoveChild) {
		          _host2.default.driver.removeChild(this._nativeNode, this._parent);
		        }
		      }
		
		      this.unmountChildren();
		
		      _hook2.default.Reconciler.unmountComponent(this);
		
		      this._currentElement = null;
		      this._nativeNode = null;
		      this._parent = null;
		      this._context = null;
		      this._instance = null;
		    }
		  }, {
		    key: 'updateComponent',
		    value: function updateComponent(prevElement, nextElement, prevContext, nextContext) {
		      // Replace current element
		      this._currentElement = nextElement;
		      this.updateChildren(this._currentElement, nextContext);
		
		      _hook2.default.Reconciler.receiveComponent(this);
		    }
		  }, {
		    key: 'getNativeNode',
		    value: function getNativeNode() {
		      if (this._nativeNode == null) {
		        this._nativeNode = _host2.default.driver.createFragment(this._instance);
		        // TODO instance cache
		      }
		
		      return this._nativeNode;
		    }
		  }, {
		    key: 'getPublicInstance',
		    value: function getPublicInstance() {
		      // TODO
		      return null;
		    }
		  }, {
		    key: 'getName',
		    value: function getName() {
		      return 'fragment';
		    }
		  }]);
		
		  return FragmentComponent;
		}(_native2.default);
		
		exports.default = FragmentComponent;
		module.exports = exports['default'];
	
	/***/ },
	/* 33 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _instance = __webpack_require__(13);
		
		var _instance2 = _interopRequireDefault(_instance);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function findComponentInstance(node) {
		  if (node == null) {
		    return null;
		  }
		  return _instance2.default.get(node);
		}
		
		exports.default = findComponentInstance;
		module.exports = exports['default'];
	
	/***/ },
	/* 34 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = '0.1.7';
		module.exports = exports['default'];
	
	/***/ }
	/******/ ])};;
	//# sourceMappingURL=rax.factory.map

/***/ },
/* 3 */
/*!****************************************************!*\
  !*** ./packages/jud-rax-framework/src/emitter.js ***!
  \****************************************************/
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/*!**********************************************************!*\
  !*** ./packages/runtime-shared/dist/promise.function.js ***!
  \**********************************************************/
/***/ function(module, exports) {

	
	module.exports = function() {
	  return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		'use strict';
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
		
		/* eslint no-extend-native: "off" */
		
		function noop() {}
		
		// Use polyfill for setImmediate for performance gains
		var asap = typeof setImmediate === 'function' && setImmediate || function (fn) {
		  if (typeof setTimeout === 'function') {
		    setTimeout(fn, 0);
		  } else {
		    fn();
		  }
		};
		
		var onUnhandledRejection = function onUnhandledRejection(err) {
		  if (typeof console !== 'undefined' && console) {
		    console.log('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
		  }
		};
		
		// Polyfill for Function.prototype.bind
		function bind(fn, thisArg) {
		  return function () {
		    fn.apply(thisArg, arguments);
		  };
		}
		
		function Promise(fn) {
		  if (_typeof(this) !== 'object') throw new TypeError('Promises must be constructed via new');
		  if (typeof fn !== 'function') throw new TypeError('Promise resolver is not a function');
		  this._state = 0;
		  this._handled = false;
		  this._value = undefined;
		  this._deferreds = [];
		
		  doResolve(fn, this);
		}
		
		function handle(self, deferred) {
		  while (self._state === 3) {
		    self = self._value;
		  }
		  if (self._state === 0) {
		    self._deferreds.push(deferred);
		    return;
		  }
		  self._handled = true;
		  asap(function () {
		    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
		    if (cb === null) {
		      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
		      return;
		    }
		    var ret;
		    try {
		      ret = cb(self._value);
		    } catch (e) {
		      reject(deferred.promise, e);
		      return;
		    }
		    resolve(deferred.promise, ret);
		  });
		}
		
		function resolve(self, newValue) {
		  try {
		    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
		    if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
		    if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
		      var then = newValue.then;
		      if (newValue instanceof Promise) {
		        self._state = 3;
		        self._value = newValue;
		        finale(self);
		        return;
		      } else if (typeof then === 'function') {
		        doResolve(bind(then, newValue), self);
		        return;
		      }
		    }
		    self._state = 1;
		    self._value = newValue;
		    finale(self);
		  } catch (e) {
		    reject(self, e);
		  }
		}
		
		function reject(self, newValue) {
		  self._state = 2;
		  self._value = newValue;
		  finale(self);
		}
		
		function finale(self) {
		  if (self._state === 2 && self._deferreds.length === 0) {
		    asap(function () {
		      if (!self._handled) {
		        onUnhandledRejection(self._value);
		      }
		    });
		  }
		
		  for (var i = 0, len = self._deferreds.length; i < len; i++) {
		    handle(self, self._deferreds[i]);
		  }
		  self._deferreds = null;
		}
		
		function Handler(onFulfilled, onRejected, promise) {
		  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		  this.promise = promise;
		}
		
		/**
		 * Take a potentially misbehaving resolver function and make sure
		 * onFulfilled and onRejected are only called once.
		 *
		 * Makes no guarantees about asynchrony.
		 */
		function doResolve(fn, self) {
		  var done = false;
		  try {
		    fn(function (value) {
		      if (done) return;
		      done = true;
		      resolve(self, value);
		    }, function (reason) {
		      if (done) return;
		      done = true;
		      reject(self, reason);
		    });
		  } catch (ex) {
		    if (done) return;
		    done = true;
		    reject(self, ex);
		  }
		}
		
		Promise.prototype.catch = function (onRejected) {
		  return this.then(null, onRejected);
		};
		
		Promise.prototype.then = function (onFulfilled, onRejected) {
		  var prom = new this.constructor(noop);
		
		  handle(this, new Handler(onFulfilled, onRejected, prom));
		  return prom;
		};
		
		Promise.all = function (arr) {
		  var args = Array.prototype.slice.call(arr);
		
		  return new Promise(function (resolve, reject) {
		    if (args.length === 0) return resolve([]);
		    var remaining = args.length;
		
		    function res(i, val) {
		      try {
		        if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
		          var then = val.then;
		          if (typeof then === 'function') {
		            then.call(val, function (val) {
		              res(i, val);
		            }, reject);
		            return;
		          }
		        }
		        args[i] = val;
		        if (--remaining === 0) {
		          resolve(args);
		        }
		      } catch (ex) {
		        reject(ex);
		      }
		    }
		
		    for (var i = 0; i < args.length; i++) {
		      res(i, args[i]);
		    }
		  });
		};
		
		Promise.resolve = function (value) {
		  if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
		    return value;
		  }
		
		  return new Promise(function (resolve) {
		    resolve(value);
		  });
		};
		
		Promise.reject = function (value) {
		  return new Promise(function (resolve, reject) {
		    reject(value);
		  });
		};
		
		Promise.race = function (values) {
		  return new Promise(function (resolve, reject) {
		    for (var i = 0, len = values.length; i < len; i++) {
		      values[i].then(resolve, reject);
		    }
		  });
		};
		
		/**
		 * Set the immediate function to execute callbacks
		 * @param fn {function} Function to execute
		 * @private
		 */
		Promise._setImmediateFn = function _setImmediateFn(fn) {
		  asap = fn;
		};
		
		Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
		  onUnhandledRejection = fn;
		};
		
		module.exports = Promise;
	
	/***/ }
	/******/ ])};;
	//# sourceMappingURL=promise.function.map

/***/ },
/* 5 */
/*!******************************************************!*\
  !*** ./packages/runtime-shared/dist/url.function.js ***!
  \******************************************************/
/***/ function(module, exports) {

	
	module.exports = function() {
	  return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		'use strict';
		
		// https://github.com/Polymer/URL
		
		var relative = Object.create(null);
		relative.ftp = 21;
		relative.file = 0;
		relative.gopher = 70;
		relative.http = 80;
		relative.https = 443;
		relative.ws = 80;
		relative.wss = 443;
		
		var relativePathDotMapping = Object.create(null);
		relativePathDotMapping['%2e'] = '.';
		relativePathDotMapping['.%2e'] = '..';
		relativePathDotMapping['%2e.'] = '..';
		relativePathDotMapping['%2e%2e'] = '..';
		
		function isRelativeScheme(scheme) {
		  return relative[scheme] !== undefined;
		}
		
		function invalid() {
		  clear.call(this);
		  this._isInvalid = true;
		}
		
		function IDNAToASCII(h) {
		  if ('' == h) {
		    invalid.call(this);
		  }
		  // XXX
		  return h.toLowerCase();
		}
		
		function percentEscape(c) {
		  var unicode = c.charCodeAt(0);
		  if (unicode > 0x20 && unicode < 0x7F &&
		  // " # < > ? `
		  [0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60].indexOf(unicode) == -1) {
		    return c;
		  }
		  return encodeURIComponent(c);
		}
		
		function percentEscapeQuery(c) {
		  // XXX This actually needs to encode c using encoding and then
		  // convert the bytes one-by-one.
		
		  var unicode = c.charCodeAt(0);
		  if (unicode > 0x20 && unicode < 0x7F &&
		  // " # < > ` (do not escape '?')
		  [0x22, 0x23, 0x3C, 0x3E, 0x60].indexOf(unicode) == -1) {
		    return c;
		  }
		  return encodeURIComponent(c);
		}
		
		var EOF = undefined,
		    ALPHA = /[a-zA-Z]/,
		    ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;
		
		function parse(input, stateOverride, base) {
		  function err(message) {
		    errors.push(message);
		  }
		
		  var state = stateOverride || 'scheme start',
		      cursor = 0,
		      buffer = '',
		      seenAt = false,
		      seenBracket = false,
		      errors = [];
		
		  loop: while ((input[cursor - 1] != EOF || cursor == 0) && !this._isInvalid) {
		    var c = input[cursor];
		    switch (state) {
		      case 'scheme start':
		        if (c && ALPHA.test(c)) {
		          buffer += c.toLowerCase(); // ASCII-safe
		          state = 'scheme';
		        } else if (!stateOverride) {
		          buffer = '';
		          state = 'no scheme';
		          continue;
		        } else {
		          err('Invalid scheme.');
		          break loop;
		        }
		        break;
		
		      case 'scheme':
		        if (c && ALPHANUMERIC.test(c)) {
		          buffer += c.toLowerCase(); // ASCII-safe
		        } else if (':' == c) {
		          this._scheme = buffer;
		          buffer = '';
		          if (stateOverride) {
		            break loop;
		          }
		          if (isRelativeScheme(this._scheme)) {
		            this._isRelative = true;
		          }
		          if ('file' == this._scheme) {
		            state = 'relative';
		          } else if (this._isRelative && base && base._scheme == this._scheme) {
		            state = 'relative or authority';
		          } else if (this._isRelative) {
		            state = 'authority first slash';
		          } else {
		            state = 'scheme data';
		          }
		        } else if (!stateOverride) {
		          buffer = '';
		          cursor = 0;
		          state = 'no scheme';
		          continue;
		        } else if (EOF == c) {
		          break loop;
		        } else {
		          err('Code point not allowed in scheme: ' + c);
		          break loop;
		        }
		        break;
		
		      case 'scheme data':
		        if ('?' == c) {
		          state = 'query';
		        } else if ('#' == c) {
		          this._fragment = '#';
		          state = 'fragment';
		        } else {
		          // XXX error handling
		          if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
		            this._schemeData += percentEscape(c);
		          }
		        }
		        break;
		
		      case 'no scheme':
		        if (!base || !isRelativeScheme(base._scheme)) {
		          err('Missing scheme.');
		          invalid.call(this);
		        } else {
		          state = 'relative';
		          continue;
		        }
		        break;
		
		      case 'relative or authority':
		        if ('/' == c && '/' == input[cursor + 1]) {
		          state = 'authority ignore slashes';
		        } else {
		          err('Expected /, got: ' + c);
		          state = 'relative';
		          continue;
		        }
		        break;
		
		      case 'relative':
		        this._isRelative = true;
		        if ('file' != this._scheme) this._scheme = base._scheme;
		        if (EOF == c) {
		          this._host = base._host;
		          this._port = base._port;
		          this._path = base._path.slice();
		          this._query = base._query;
		          this._username = base._username;
		          this._password = base._password;
		          break loop;
		        } else if ('/' == c || '\\' == c) {
		          if ('\\' == c) err('\\ is an invalid code point.');
		          state = 'relative slash';
		        } else if ('?' == c) {
		          this._host = base._host;
		          this._port = base._port;
		          this._path = base._path.slice();
		          this._query = '?';
		          this._username = base._username;
		          this._password = base._password;
		          state = 'query';
		        } else if ('#' == c) {
		          this._host = base._host;
		          this._port = base._port;
		          this._path = base._path.slice();
		          this._query = base._query;
		          this._fragment = '#';
		          this._username = base._username;
		          this._password = base._password;
		          state = 'fragment';
		        } else {
		          var nextC = input[cursor + 1];
		          var nextNextC = input[cursor + 2];
		          if ('file' != this._scheme || !ALPHA.test(c) || nextC != ':' && nextC != '|' || EOF != nextNextC && '/' != nextNextC && '\\' != nextNextC && '?' != nextNextC && '#' != nextNextC) {
		            this._host = base._host;
		            this._port = base._port;
		            this._username = base._username;
		            this._password = base._password;
		            this._path = base._path.slice();
		            this._path.pop();
		          }
		          state = 'relative path';
		          continue;
		        }
		        break;
		
		      case 'relative slash':
		        if ('/' == c || '\\' == c) {
		          if ('\\' == c) {
		            err('\\ is an invalid code point.');
		          }
		          if ('file' == this._scheme) {
		            state = 'file host';
		          } else {
		            state = 'authority ignore slashes';
		          }
		        } else {
		          if ('file' != this._scheme) {
		            this._host = base._host;
		            this._port = base._port;
		            this._username = base._username;
		            this._password = base._password;
		          }
		          state = 'relative path';
		          continue;
		        }
		        break;
		
		      case 'authority first slash':
		        if ('/' == c) {
		          state = 'authority second slash';
		        } else {
		          err("Expected '/', got: " + c);
		          state = 'authority ignore slashes';
		          continue;
		        }
		        break;
		
		      case 'authority second slash':
		        state = 'authority ignore slashes';
		        if ('/' != c) {
		          err("Expected '/', got: " + c);
		          continue;
		        }
		        break;
		
		      case 'authority ignore slashes':
		        if ('/' != c && '\\' != c) {
		          state = 'authority';
		          continue;
		        } else {
		          err('Expected authority, got: ' + c);
		        }
		        break;
		
		      case 'authority':
		        if ('@' == c) {
		          if (seenAt) {
		            err('@ already seen.');
		            buffer += '%40';
		          }
		          seenAt = true;
		          for (var i = 0; i < buffer.length; i++) {
		            var cp = buffer[i];
		            if ('\t' == cp || '\n' == cp || '\r' == cp) {
		              err('Invalid whitespace in authority.');
		              continue;
		            }
		            // XXX check URL code points
		            if (':' == cp && null === this._password) {
		              this._password = '';
		              continue;
		            }
		            var tempC = percentEscape(cp);
		            null !== this._password ? this._password += tempC : this._username += tempC;
		          }
		          buffer = '';
		        } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
		          cursor -= buffer.length;
		          buffer = '';
		          state = 'host';
		          continue;
		        } else {
		          buffer += c;
		        }
		        break;
		
		      case 'file host':
		        if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
		          if (buffer.length == 2 && ALPHA.test(buffer[0]) && (buffer[1] == ':' || buffer[1] == '|')) {
		            state = 'relative path';
		          } else if (buffer.length == 0) {
		            state = 'relative path start';
		          } else {
		            this._host = IDNAToASCII.call(this, buffer);
		            buffer = '';
		            state = 'relative path start';
		          }
		          continue;
		        } else if ('\t' == c || '\n' == c || '\r' == c) {
		          err('Invalid whitespace in file host.');
		        } else {
		          buffer += c;
		        }
		        break;
		
		      case 'host':
		      case 'hostname':
		        if (':' == c && !seenBracket) {
		          // XXX host parsing
		          this._host = IDNAToASCII.call(this, buffer);
		          buffer = '';
		          state = 'port';
		          if ('hostname' == stateOverride) {
		            break loop;
		          }
		        } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
		          this._host = IDNAToASCII.call(this, buffer);
		          buffer = '';
		          state = 'relative path start';
		          if (stateOverride) {
		            break loop;
		          }
		          continue;
		        } else if ('\t' != c && '\n' != c && '\r' != c) {
		          if ('[' == c) {
		            seenBracket = true;
		          } else if (']' == c) {
		            seenBracket = false;
		          }
		          buffer += c;
		        } else {
		          err('Invalid code point in host/hostname: ' + c);
		        }
		        break;
		
		      case 'port':
		        if (/[0-9]/.test(c)) {
		          buffer += c;
		        } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c || stateOverride) {
		          if ('' != buffer) {
		            var temp = parseInt(buffer, 10);
		            if (temp != relative[this._scheme]) {
		              this._port = temp + '';
		            }
		            buffer = '';
		          }
		          if (stateOverride) {
		            break loop;
		          }
		          state = 'relative path start';
		          continue;
		        } else if ('\t' == c || '\n' == c || '\r' == c) {
		          err('Invalid code point in port: ' + c);
		        } else {
		          invalid.call(this);
		        }
		        break;
		
		      case 'relative path start':
		        if ('\\' == c) err("'\\' not allowed in path.");
		        state = 'relative path';
		        if ('/' != c && '\\' != c) {
		          continue;
		        }
		        break;
		
		      case 'relative path':
		        if (EOF == c || '/' == c || '\\' == c || !stateOverride && ('?' == c || '#' == c)) {
		          if ('\\' == c) {
		            err('\\ not allowed in relative path.');
		          }
		          var tmp;
		          if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
		            buffer = tmp;
		          }
		          if ('..' == buffer) {
		            this._path.pop();
		            if ('/' != c && '\\' != c) {
		              this._path.push('');
		            }
		          } else if ('.' == buffer && '/' != c && '\\' != c) {
		            this._path.push('');
		          } else if ('.' != buffer) {
		            if ('file' == this._scheme && this._path.length == 0 && buffer.length == 2 && ALPHA.test(buffer[0]) && buffer[1] == '|') {
		              buffer = buffer[0] + ':';
		            }
		            this._path.push(buffer);
		          }
		          buffer = '';
		          if ('?' == c) {
		            this._query = '?';
		            state = 'query';
		          } else if ('#' == c) {
		            this._fragment = '#';
		            state = 'fragment';
		          }
		        } else if ('\t' != c && '\n' != c && '\r' != c) {
		          buffer += percentEscape(c);
		        }
		        break;
		
		      case 'query':
		        if (!stateOverride && '#' == c) {
		          this._fragment = '#';
		          state = 'fragment';
		        } else if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
		          this._query += percentEscapeQuery(c);
		        }
		        break;
		
		      case 'fragment':
		        if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
		          this._fragment += c;
		        }
		        break;
		    }
		
		    cursor++;
		  }
		}
		
		function clear() {
		  this._scheme = '';
		  this._schemeData = '';
		  this._username = '';
		  this._password = null;
		  this._host = '';
		  this._port = '';
		  this._path = [];
		  this._query = '';
		  this._fragment = '';
		  this._isInvalid = false;
		  this._isRelative = false;
		}
		
		// Does not process domain names or IP addresses.
		// Does not handle encoding for the query parameter.
		function URL(url, base /* , encoding */) {
		  if (base !== undefined && !(base instanceof URL)) base = new URL(String(base));
		
		  this._url = url;
		  clear.call(this);
		
		  var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
		  // encoding = encoding || 'utf-8'
		
		  parse.call(this, input, null, base);
		}
		
		URL.prototype = {
		  toString: function toString() {
		    return this.href;
		  },
		  get href() {
		    if (this._isInvalid) return this._url;
		
		    var authority = '';
		    if ('' != this._username || null != this._password) {
		      authority = this._username + (null != this._password ? ':' + this._password : '') + '@';
		    }
		
		    return this.protocol + (this._isRelative ? '//' + authority + this.host : '') + this.pathname + this._query + this._fragment;
		  },
		  set href(href) {
		    clear.call(this);
		    parse.call(this, href);
		  },
		
		  get protocol() {
		    return this._scheme + ':';
		  },
		  set protocol(protocol) {
		    if (this._isInvalid) return;
		    parse.call(this, protocol + ':', 'scheme start');
		  },
		
		  get host() {
		    return this._isInvalid ? '' : this._port ? this._host + ':' + this._port : this._host;
		  },
		  set host(host) {
		    if (this._isInvalid || !this._isRelative) return;
		    parse.call(this, host, 'host');
		  },
		
		  get hostname() {
		    return this._host;
		  },
		  set hostname(hostname) {
		    if (this._isInvalid || !this._isRelative) return;
		    parse.call(this, hostname, 'hostname');
		  },
		
		  get port() {
		    return this._port;
		  },
		  set port(port) {
		    if (this._isInvalid || !this._isRelative) return;
		    parse.call(this, port, 'port');
		  },
		
		  get pathname() {
		    return this._isInvalid ? '' : this._isRelative ? '/' + this._path.join('/') : this._schemeData;
		  },
		  set pathname(pathname) {
		    if (this._isInvalid || !this._isRelative) return;
		    this._path = [];
		    parse.call(this, pathname, 'relative path start');
		  },
		
		  get search() {
		    return this._isInvalid || !this._query || '?' == this._query ? '' : this._query;
		  },
		  set search(search) {
		    if (this._isInvalid || !this._isRelative) return;
		    this._query = '?';
		    if ('?' == search[0]) search = search.slice(1);
		    parse.call(this, search, 'query');
		  },
		
		  get hash() {
		    return this._isInvalid || !this._fragment || '#' == this._fragment ? '' : this._fragment;
		  },
		  set hash(hash) {
		    if (this._isInvalid) return;
		    this._fragment = '#';
		    if ('#' == hash[0]) hash = hash.slice(1);
		    parse.call(this, hash, 'fragment');
		  },
		
		  get origin() {
		    var host;
		    if (this._isInvalid || !this._scheme) {
		      return '';
		    }
		    // javascript: Gecko returns String(""), WebKit/Blink String("null")
		    // Gecko throws error for "data://"
		    // data: Gecko returns "", Blink returns "data://", WebKit returns "null"
		    // Gecko returns String("") for file: mailto:
		    // WebKit/Blink returns String("SCHEME://") for file: mailto:
		    switch (this._scheme) {
		      case 'data':
		      case 'file':
		      case 'javascript':
		      case 'mailto':
		        return 'null';
		    }
		    host = this.host;
		    if (!host) {
		      return '';
		    }
		    return this._scheme + '://' + host;
		  }
		};
		
		module.exports = URL;
	
	/***/ }
	/******/ ])};;
	//# sourceMappingURL=url.function.map

/***/ },
/* 6 */
/*!********************************************************************!*\
  !*** ./packages/runtime-shared/dist/url-search-params.function.js ***!
  \********************************************************************/
/***/ function(module, exports) {

	
	module.exports = function() {
	  return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		'use strict';
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		// https://github.com/WebReflection/url-search-params
		
		var find = /[!'\(\)~]|%20|%00/g,
		    plus = /\+/g,
		    replace = {
		  '!': '%21',
		  "'": '%27',
		  '(': '%28',
		  ')': '%29',
		  '~': '%7E',
		  '%20': '+',
		  '%00': '\x00'
		},
		    replacer = function replacer(match) {
		  return replace[match];
		},
		    iterable = isIterable(),
		    secret = '__URLSearchParams__';
		
		function encode(str) {
		  return encodeURIComponent(str).replace(find, replacer);
		}
		
		function decode(str) {
		  return decodeURIComponent(str.replace(plus, ' '));
		}
		
		function isIterable() {
		  try {
		    return !!Symbol.iterator;
		  } catch (error) {
		    return false;
		  }
		}
		
		var URLSearchParams = function () {
		  function URLSearchParams(query) {
		    _classCallCheck(this, URLSearchParams);
		
		    this[secret] = Object.create(null);
		    if (!query) return;
		    if (query.charAt(0) === '?') {
		      query = query.slice(1);
		    }
		    for (var index, value, pairs = (query || '').split('&'), i = 0, length = pairs.length; i < length; i++) {
		      value = pairs[i];
		      index = value.indexOf('=');
		      if (-1 < index) {
		        this.append(decode(value.slice(0, index)), decode(value.slice(index + 1)));
		      } else if (value.length) {
		        this.append(decode(value), '');
		      }
		    }
		  }
		
		  _createClass(URLSearchParams, [{
		    key: 'append',
		    value: function append(name, value) {
		      var dict = this[secret];
		      if (name in dict) {
		        dict[name].push('' + value);
		      } else {
		        dict[name] = ['' + value];
		      }
		    }
		  }, {
		    key: 'delete',
		    value: function _delete(name) {
		      delete this[secret][name];
		    }
		  }, {
		    key: 'get',
		    value: function get(name) {
		      var dict = this[secret];
		      return name in dict ? dict[name][0] : null;
		    }
		  }, {
		    key: 'getAll',
		    value: function getAll(name) {
		      var dict = this[secret];
		      return name in dict ? dict[name].slice(0) : [];
		    }
		  }, {
		    key: 'has',
		    value: function has(name) {
		      return name in this[secret];
		    }
		  }, {
		    key: 'set',
		    value: function set(name, value) {
		      this[secret][name] = ['' + value];
		    }
		  }, {
		    key: 'forEach',
		    value: function forEach(callback, thisArg) {
		      var dict = this[secret];
		      Object.getOwnPropertyNames(dict).forEach(function (name) {
		        dict[name].forEach(function (value) {
		          callback.call(thisArg, value, name, this);
		        }, this);
		      }, this);
		    }
		  }, {
		    key: 'keys',
		    value: function keys() {
		      var items = [];
		      this.forEach(function (value, name) {
		        items.push(name);
		      });
		      var iterator = {
		        next: function next() {
		          var value = items.shift();
		          return { done: value === undefined, value: value };
		        }
		      };
		
		      if (iterable) {
		        iterator[Symbol.iterator] = function () {
		          return iterator;
		        };
		      }
		
		      return iterator;
		    }
		  }, {
		    key: 'values',
		    value: function values() {
		      var items = [];
		      this.forEach(function (value) {
		        items.push(value);
		      });
		      var iterator = {
		        next: function next() {
		          var value = items.shift();
		          return { done: value === undefined, value: value };
		        }
		      };
		
		      if (iterable) {
		        iterator[Symbol.iterator] = function () {
		          return iterator;
		        };
		      }
		
		      return iterator;
		    }
		  }, {
		    key: 'entries',
		    value: function entries() {
		      var items = [];
		      this.forEach(function (value, name) {
		        items.push([name, value]);
		      });
		      var iterator = {
		        next: function next() {
		          var value = items.shift();
		          return { done: value === undefined, value: value };
		        }
		      };
		
		      if (iterable) {
		        iterator[Symbol.iterator] = function () {
		          return iterator;
		        };
		      }
		
		      return iterator;
		    }
		  }, {
		    key: 'toString',
		    value: function toString() {
		      var dict = this[secret],
		          query = [],
		          i,
		          key,
		          name,
		          value;
		      for (key in dict) {
		        name = encode(key);
		        for (i = 0, value = dict[key]; i < value.length; i++) {
		          query.push(name + '=' + encode(value[i]));
		        }
		      }
		      return query.join('&');
		    }
		  }]);
		
		  return URLSearchParams;
		}();
		
		if (iterable) {
		  URLSearchParams.prototype[Symbol.iterator] = URLSearchParams.prototype.entries;
		}
		
		module.exports = URLSearchParams;
	
	/***/ }
	/******/ ])};;
	//# sourceMappingURL=url-search-params.function.map

/***/ },
/* 7 */
/*!***********************************************************!*\
  !*** ./packages/runtime-shared/dist/fontface.function.js ***!
  \***********************************************************/
/***/ function(module, exports) {

	
	module.exports = function() {
	  return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		"use strict";
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		var FontFace = function FontFace(family, source) {
		  _classCallCheck(this, FontFace);
		
		  this.family = family;
		  this.source = source;
		};
		
		module.exports = FontFace;
	
	/***/ }
	/******/ ])};;
	//# sourceMappingURL=fontface.function.map

/***/ },
/* 8 */
/*!*************************************************************!*\
  !*** ./packages/runtime-shared/dist/matchMedia.function.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	
	module.exports = function() {
	  return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		'use strict';
		
		// https://github.com/ericf/css-mediaquery
		
		var RE_MEDIA_QUERY = /^(?:(only|not)?\s*([_a-z][_a-z0-9-]*)|(\([^\)]+\)))(?:\s*and\s*(.*))?$/i,
		    RE_MQ_EXPRESSION = /^\(\s*([_a-z-][_a-z0-9-]*)\s*(?:\:\s*([^\)]+))?\s*\)$/,
		    RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/;
		
		function _matches(media, values) {
		  return _parseQuery(media).some(function (query) {
		    var inverse = query.inverse;
		
		    var typeMatch = query.type === 'all' || values.type === query.type;
		
		    if (typeMatch && inverse || !(typeMatch || inverse)) {
		      return false;
		    }
		
		    var expressionsMatch = query.expressions.every(function (expression) {
		      var feature = expression.feature,
		          modifier = expression.modifier,
		          expValue = expression.value,
		          value = values[feature];
		
		      if (!value) {
		        return false;
		      }
		
		      switch (feature) {
		        case 'width':
		        case 'height':
		          expValue = parseFloat(expValue);
		          value = parseFloat(value);
		          break;
		      }
		
		      switch (modifier) {
		        case 'min':
		          return value >= expValue;
		        case 'max':
		          return value <= expValue;
		        default:
		          return value === expValue;
		      }
		    });
		
		    return expressionsMatch && !inverse || !expressionsMatch && inverse;
		  });
		};
		
		function _parseQuery(media) {
		  return media.split(',').map(function (query) {
		    query = query.trim();
		
		    var captures = query.match(RE_MEDIA_QUERY);
		
		    if (!captures) {
		      throw new SyntaxError('Invalid CSS media query: "' + query + '"');
		    }
		
		    var modifier = captures[1],
		        type = captures[2],
		        expressions = ((captures[3] || '') + (captures[4] || '')).trim(),
		        parsed = {};
		
		    parsed.inverse = !!modifier && modifier.toLowerCase() === 'not';
		    parsed.type = type ? type.toLowerCase() : 'all';
		
		    if (!expressions) {
		      parsed.expressions = [];
		      return parsed;
		    }
		
		    expressions = expressions.match(/\([^\)]+\)/g);
		
		    if (!expressions) {
		      throw new SyntaxError('Invalid CSS media query: "' + query + '"');
		    }
		
		    parsed.expressions = expressions.map(function (expression) {
		      var captures = expression.match(RE_MQ_EXPRESSION);
		
		      if (!captures) {
		        throw new SyntaxError('Invalid CSS media query: "' + query + '"');
		      }
		
		      var feature = captures[1].toLowerCase().match(RE_MQ_FEATURE);
		
		      return {
		        modifier: feature[1],
		        feature: feature[2],
		        value: captures[2]
		      };
		    });
		
		    return parsed;
		  });
		};
		
		function matchMedia(media) {
		  var mql = {
		    matches: false,
		    media: media
		  };
		
		  if (media === '') {
		    mql.matches = true;
		    return mql;
		  }
		
		  mql.matches = _matches(media, {
		    type: 'screen',
		    width: window.screen.width,
		    height: window.screen.height
		  });
		
		  return mql;
		}
		
		module.exports = matchMedia;
	
	/***/ }
	/******/ ])};;
	//# sourceMappingURL=matchMedia.function.map

/***/ },
/* 9 */
/*!********************************************************!*\
  !*** ./packages/jud-rax-framework/src/define.jud.js ***!
  \********************************************************/
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (modules) {
	  function define(name, deps, factory) {
	    if (deps instanceof Function) {
	      factory = deps;
	      deps = [];
	    }
	
	    modules[name] = {
	      factory: factory,
	      deps: deps,
	      module: { exports: {} },
	      isInitialized: false,
	      hasError: false
	    };
	  }
	
	  return define;
	};

/***/ },
/* 10 */
/*!*********************************************************!*\
  !*** ./packages/jud-rax-framework/src/require.jud.js ***!
  \*********************************************************/
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (modules) {
	  function require(name) {
	    var mod = modules[name];
	
	    if (mod && mod.isInitialized) {
	      return mod.module.exports;
	    }
	
	    if (!mod) {
	      throw new Error('Requiring unknown module "' + name + '"');
	    }
	
	    if (mod.hasError) {
	      throw new Error('Requiring module "' + name + '" which threw an exception');
	    }
	
	    try {
	      mod.isInitialized = true;
	      mod.factory(require, mod.module.exports, mod.module);
	    } catch (e) {
	      mod.hasError = true;
	      mod.isInitialized = false;
	      throw e;
	    }
	
	    return mod.module.exports;
	  }
	
	  return require;
	};

/***/ },
/* 11 */
/*!***********************************************************!*\
  !*** ./packages/jud-rax-framework/src/downgrade.jud.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _semver = __webpack_require__(/*! ./semver */ 12);
	
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

/***/ },
/* 12 */
/*!***************************************************!*\
  !*** ./packages/jud-rax-framework/src/semver.js ***!
  \***************************************************/
/***/ function(module, exports) {

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

/***/ },
/* 13 */
/*!**********************************************************!*\
  !*** ./packages/jud-rax-framework/src/document.jud.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _emitter = __webpack_require__(/*! ./emitter */ 3);
	
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

/***/ },
/* 14 */
/*!*******************************************************!*\
  !*** ./packages/jud-rax-framework/src/fetch.jud.js ***!
  \*******************************************************/
/***/ function(module, exports) {

	'use strict';
	
	var STREAM_MODULE = '@jud-module/stream';
	
	module.exports = function (__jud_require__, Promise) {
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    // FIXME: In spdy the response header has name like ":version" that is invalid
	    // if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	    //   throw new TypeError('Invalid character in header field name');
	    // }
	    return name.toLowerCase();
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value;
	  }
	
	  function Headers(headers) {
	    this.originHeaders = headers;
	    this.map = {};
	
	    if (headers instanceof Headers) {
	      headers.forEach(function (value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function (name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }
	
	  Headers.prototype.append = function (name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var oldValue = this.map[name];
	    this.map[name] = oldValue ? oldValue + ',' + value : value;
	  };
	
	  Headers.prototype.delete = function (name) {
	    delete this.map[normalizeName(name)];
	  };
	
	  Headers.prototype.get = function (name) {
	    name = normalizeName(name);
	    return this.has(name) ? this.map[name] : null;
	  };
	
	  Headers.prototype.has = function (name) {
	    return this.map.hasOwnProperty(normalizeName(name));
	  };
	
	  Headers.prototype.set = function (name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)];
	  };
	
	  Headers.prototype.forEach = function (callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this);
	      }
	    }
	  };
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'));
	    }
	    body.bodyUsed = true;
	  }
	
	  function Body() {
	    this.bodyUsed = false;
	
	    this._initBody = function (body, options) {
	      this._bodyInit = body;
	      if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (!body) {
	        this._bodyText = '';
	      } else {
	        throw new Error('unsupported BodyInit type');
	      }
	    };
	
	    this.text = function () {
	      var rejected = consumed(this);
	      return rejected ? rejected : Promise.resolve(this._bodyText);
	    };
	
	    this.json = function () {
	      return this.text().then(JSON.parse);
	    };
	
	    return this;
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method;
	  }
	
	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read');
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      if (!body) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = input;
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.referrer = null;
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests');
	    }
	    this._initBody(body, options);
	  }
	
	  Request.prototype.clone = function () {
	    return new Request(this);
	  };
	
	  function headers(xhr) {
	    var head = new Headers();
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n');
	    pairs.forEach(function (header) {
	      var split = header.trim().split(':');
	      var key = split.shift().trim();
	      var value = split.join(':').trim();
	      head.append(key, value);
	    });
	    return head;
	  }
	
	  Body.call(Request.prototype);
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }
	
	    this.type = 'default';
	    this.status = 'status' in options ? options.status : 200;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = 'statusText' in options ? options.statusText : 'OK';
	    this.headers = new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit, options);
	  }
	
	  Body.call(Response.prototype);
	
	  Response.prototype.clone = function () {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    });
	  };
	
	  Response.error = function () {
	    var response = new Response(null, { status: 0, statusText: '' });
	    response.type = 'error';
	    return response;
	  };
	
	  var redirectStatuses = [301, 302, 303, 307, 308];
	
	  Response.redirect = function (url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code');
	    }
	
	    return new Response(null, { status: status, headers: { location: url } });
	  };
	
	  var fetch = function fetch(input, init) {
	    return new Promise(function (resolve, reject) {
	      var request;
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input;
	      } else {
	        request = new Request(input, init);
	      }
	
	      var params = {
	        url: request.url,
	        method: request.method,
	        headers: request.headers && request.headers.originHeaders
	      };
	
	      if (typeof request._bodyInit !== 'undefined') {
	        params.body = request._bodyInit;
	      }
	
	      params.type = init && init.dataType ? init.dataType : 'json';
	      var nativeFetch = __jud_require__(STREAM_MODULE).fetch;
	      nativeFetch(params, function (response) {
	        try {
	          typeof response === 'string' && (response = JSON.parse(response));
	          var data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
	
	          var res = new Response(data, {
	            status: response.status,
	            statusText: response.statusText,
	            headers: response.headers,
	            url: request.url
	          });
	          resolve(res);
	        } catch (err) {
	          reject(err);
	        }
	      }, function (progress) {});
	    });
	  };
	
	  return {
	    fetch: fetch,
	    Headers: Headers,
	    Request: Request,
	    Response: Response
	  };
	};

/***/ },
/* 15 */
/*!*******************************************************!*\
  !*** ./packages/jud-rax-framework/src/timer.jud.js ***!
  \*******************************************************/
/***/ function(module, exports) {

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

/***/ },
/* 16 */
/*!********************************************************!*\
  !*** ./packages/jud-rax-framework/src/base64.jud.js ***!
  \********************************************************/
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
	  var base64 = {};
	  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	  // encoder
	  // [https://gist.github.com/999166] by [https://github.com/nignag]
	  base64.btoa = function (input) {
	    var str = String(input);
	    for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars, output = '';
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
	      charCode = str.charCodeAt(idx += 3 / 4);
	      if (charCode > 0xFF) {
	        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
	      }
	      block = block << 8 | charCode;
	    }
	    return output;
	  };
	
	  // decoder
	  // [https://gist.github.com/1020396] by [https://github.com/atk]
	  base64.atob = function (input) {
	    var str = String(input).replace(/=+$/, '');
	    if (str.length % 4 == 1) {
	      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
	    }
	    for (
	    // initialize result and counters
	    var bc = 0, bs, buffer, idx = 0, output = '';
	    // get next character
	    buffer = str.charAt(idx++);
	    // character found in table? initialize bit storage and add its ascii value;
	    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
	    // and if not first of each 4 characters,
	    // convert the first 8 bits to one ascii character
	    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
	      // try to find character in table (0-63, not found => -1)
	      buffer = chars.indexOf(buffer);
	    }
	    return output;
	  };
	
	  return base64;
	};

/***/ },
/* 17 */
/*!*************************************************************!*\
  !*** ./packages/jud-rax-framework/src/performance.jud.js ***!
  \*************************************************************/
/***/ function(module, exports) {

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

/***/ }
/******/ ]);
//# sourceMappingURL=framework.jud.map