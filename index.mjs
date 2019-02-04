import React from 'react';
import ref from 'referential';
import akasha from 'akasha';

//  rollupPluginBabelHelpers.js

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

// src/index.js
let RefContext = React.createContext(ref({}));
let lock = false;
class RefProvider extends React.Component {
  constructor(props) {
    super(props);
    let data = props.data;

    if (!data && typeof window != 'undefined') {
      data = akasha.get('data');
    }

    this.state = {
      value: {
        data: ref(data)
      },
      appIsMounted: false
    };
    this.state.value.data.on('set', () => {
      if (typeof window != undefined) {
        akasha.set('data', this.state.value.data.get());
      }

      if (lock) {
        return;
      }

      lock = true;
      requestAnimationFrame(() => {
        lock = false;
        this.setState({
          value: {
            data: this.state.value.data
          }
        });
      });
    });
  }

  componentDidMount() {
    console.log('Ref Provider Mounted');
    this.setState({
      appIsMounted: true
    });
  }

  render() {
    let newProps = Object.assign({}, this.props);
    return React.createElement(RefContext.Provider, {
      value: this.state.value
    }, this.state.appIsMounted ? this.props.children : React.createElement("div", null));
  }

}
let watch = key => {
  return WrappedComponent => {
    return class WatchedComponent extends React.Component {
      constructor(props) {
        super(props);
      }

      componentWillUnmount() {
        if (this.data) {
          this.data.destroy();
        }
      }

      render() {
        let props = this.props;
        let newProps = Object.assign({}, props);
        return React.createElement(RefContext.Consumer, null, ({
          data
        }) => {
          // prioritize props.data over context data field
          let contextData = data;

          if (this.data) {
            contextData = this.data;
          } else if (props.data) {
            contextData = props.data;
          } // avoid duplication


          if (!this.data) {
            // key essentially namespaces the data, either namespace the
            // context free one from the Ref context or a contexualized one
            // from props
            if (key) {
              if (props.data) {
                contextData = this.data = props.data.ref(key);
              } else {
                contextData = this.data = data.ref(key);
              }
            }
          }

          return React.createElement(WrappedComponent, _extends({}, newProps, {
            rootData: data,
            data: contextData
          }));
        });
      }

    };
  };
};

export default RefProvider;
export { RefContext, watch };
//# sourceMappingURL=index.mjs.map
