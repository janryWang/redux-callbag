"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mitt = _interopRequireDefault(require("mitt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

      sink(0, function (t) {
        if (t === 2) emitter.off('action', handler);
      });
      emitter.on('action', handler);
    };

    epicses.forEach(function (epics) {
      if (typeof epics === 'function') {
        epics(actions, store);
      }
    });
    return function (next) {
      return function (action) {
        emitter.emit('action', action);
        return next(action);
      };
    };
  };
};

exports.default = _default;