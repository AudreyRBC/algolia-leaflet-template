'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ClearAll = require('../ClearAll');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ClearAll', function () {
  var defaultProps = {
    refine: function refine() {},
    cssClasses: {
      link: 'custom-link'
    },
    hasRefinements: false,
    templateProps: {
      templates: {
        link: ''
      }
    },
    url: '#all-cleared!'
  };

  it('should render <ClearAll />', function () {
    var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_ClearAll.RawClearAll, defaultProps)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should handle clicks (and special clicks)', function () {
    var props = {
      refine: _sinon2.default.spy()
    };
    var preventDefault = _sinon2.default.spy();
    var component = new _ClearAll.RawClearAll(props);
    ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'].forEach(function (e) {
      var event = { preventDefault: preventDefault };
      event[e] = true;
      component.handleClick(event);
      expect(props.refine.called).toBe(false, 'clearAll never called');
      expect(preventDefault.called).toBe(false, 'preventDefault never called');
    });
    component.handleClick({ preventDefault: preventDefault });
    expect(props.refine.calledOnce).toBe(true, 'clearAll called once');
    expect(preventDefault.calledOnce).toBe(true, 'preventDefault called once');
  });
});