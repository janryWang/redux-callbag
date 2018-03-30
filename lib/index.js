"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapFailTo = exports.mapSuccessTo = exports.select = exports.mapFromPromise = exports.default = void 0;

var _mitt = _interopRequireDefault(require("mitt"));

var _callbagMapPromise = _interopRequireDefault(require("callbag-map-promise"));

var _callbagFilter = _interopRequireDefault(require("callbag-filter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFn = function isFn(val) {
  return typeof val === 'function';
};

var _default = function _default() {
  for (var _len = arguments.length, epicses = new Array(_len), _key = 0; _key < _len; _key++) {
    epicses[_key] = arguments[_key];
  }

  return function (store) {
    var emitter = (0, _mitt.default)();

    var actions = function actions(start, sink) {
      if (start !== 0) return;

      var handler = function handler(ev) {
        return sink(1, ev);
      };

      sink(0, function (t, d) {
        if (t === 2) emitter.off("action", handler);

        if (t === 1) {
          if (d && d.action) {
            store.dispatch(d.action);
          }
        }
      });
      emitter.on("action", handler);
    };

    epicses.forEach(function (epics) {
      if (typeof epics === "function") {
        epics(actions, store);
      }
    });
    return function (next) {
      return function (action) {
        emitter.emit("action", action);
        return next(action);
      };
    };
  };
};

exports.default = _default;
var mapFromPromise = _callbagMapPromise.default;
exports.mapFromPromise = mapFromPromise;

var select = function select(_type) {
  return function (source) {
    return (0, _callbagFilter.default)(function (_ref) {
      var type = _ref.type;
      return type === _type;
    })(source);
  };
};

exports.select = select;

var mapSuccessTo = function mapSuccessTo(actionType, fn) {
  return function (source) {
    var talkback;
    source(0, function (t, d) {
      if (t === 0) {
        talkback = d;
      }

      if (t === 1) {
        talkback(1, {
          action: {
            type: actionType,
            payload: isFn(fn) ? fn(d.payload) : d
          }
        });
      }
    });
    return function (t, sink) {
      if (t !== 0) return;
      source(0, function (t, d) {
        sink(t, d);
      });
    };
  };
};

exports.mapSuccessTo = mapSuccessTo;

var mapFailTo = function mapFailTo(actionType, fn) {
  return function (source) {
    var talkback;
    source(0, function (t, d) {
      if (t === 0) {
        talkback = d;
      }

      if (t === 2 && d !== undefined) {
        talkback(1, {
          action: {
            type: actionType,
            payload: isFn(fn) ? fn(d.payload) : d
          }
        });
      }
    });
    return function (t, sink) {
      if (t !== 0) return;
      source(0, function (t, d) {
        sink(t, d);
      });
    };
  };
};

exports.mapFailTo = mapFailTo;