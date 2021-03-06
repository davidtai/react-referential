'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ref = _interopDefault(require('referential'));
var akasha = _interopDefault(require('akasha'));

//  rollupPluginBabelHelpers.js

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

// src/index.js
var RefContext = React.createContext(ref({}));
var lock = false;

var RefProvider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RefProvider, _React$Component);

  function RefProvider(props) {
    var _this;

    _classCallCheck(this, RefProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RefProvider).call(this, props));
    var data = props.data;

    if (!data && typeof window != 'undefined') {
      data = akasha.get('data');
    }

    _this.state = {
      value: {
        data: ref(data)
      },
      appIsMounted: false
    };

    _this.state.value.data.on('set', function () {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) != undefined) {
        akasha.set('data', _this.state.value.data.get());
      }

      if (lock) {
        return;
      }

      lock = true;
      requestAnimationFrame(function () {
        lock = false;

        _this.setState({
          value: {
            data: _this.state.value.data
          }
        });
      });
    });

    return _this;
  }

  _createClass(RefProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('Ref Provider Mounted');
      this.setState({
        appIsMounted: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var newProps = Object.assign({}, this.props);
      return React.createElement(RefContext.Provider, {
        value: this.state.value
      }, this.state.appIsMounted ? this.props.children : React.createElement("div", null));
    }
  }]);

  return RefProvider;
}(React.Component);
var watch = function watch(key) {
  return function (WrappedComponent) {
    return (
      /*#__PURE__*/
      function (_React$Component2) {
        _inherits(WatchedComponent, _React$Component2);

        function WatchedComponent(props) {
          _classCallCheck(this, WatchedComponent);

          return _possibleConstructorReturn(this, _getPrototypeOf(WatchedComponent).call(this, props));
        }

        _createClass(WatchedComponent, [{
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            if (this.data) {
              this.data.destroy();
            }
          }
        }, {
          key: "render",
          value: function render() {
            var _this2 = this;

            var props = this.props;
            var newProps = Object.assign({}, props);
            return React.createElement(RefContext.Consumer, null, function (_ref) {
              var data = _ref.data;
              // prioritize props.data over context data field
              var contextData = data;

              if (_this2.data) {
                contextData = _this2.data;
              } else if (props.data) {
                contextData = props.data;
              } // avoid duplication


              if (!_this2.data) {
                // key essentially namespaces the data, either namespace the
                // context free one from the Ref context or a contexualized one
                // from props
                if (key) {
                  if (props.data) {
                    contextData = _this2.data = props.data.ref(key);
                  } else {
                    contextData = _this2.data = data.ref(key);
                  }
                }
              }

              return React.createElement(WrappedComponent, _extends({}, newProps, {
                rootData: data,
                data: contextData
              }));
            });
          }
        }]);

        return WatchedComponent;
      }(React.Component)
    );
  };
};

exports.RefContext = RefContext;
exports.default = RefProvider;
exports.watch = watch;
//# sourceMappingURL=index.js.map
