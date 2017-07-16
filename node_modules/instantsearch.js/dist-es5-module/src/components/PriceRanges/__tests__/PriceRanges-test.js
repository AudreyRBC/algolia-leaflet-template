'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _PriceRanges = require('../PriceRanges');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _testUtils = require('react-dom/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('PriceRanges', function () {
  var defaultProps = {
    refine: function refine() {},

    templateProps: {
      templates: {
        item: '{{name}} {{value}} {{currency}}'
      }
    }
  };

  var stubbedMethods = void 0;

  beforeEach(function () {
    stubbedMethods = [];
  });

  afterEach(function () {
    // Restore all stubbed methods
    stubbedMethods.forEach(function (name) {
      _PriceRanges.RawPriceRanges.prototype[name].restore();
    });
  });

  function getComponentWithMockRendering(extraProps) {
    var props = _extends({}, defaultProps, extraProps);
    return _testUtils2.default.renderIntoDocument(_react2.default.createElement(_PriceRanges.RawPriceRanges, props));
  }

  function stubMethod(methodName) {
    var returnValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    stubbedMethods.push(methodName);
    return _sinon2.default.stub(_PriceRanges.RawPriceRanges.prototype, methodName).returns(returnValue);
  }

  describe('individual methods', function () {
    beforeEach(function () {
      stubMethod('render');
    });

    describe('getItemFromFacetValue', function () {
      var props = void 0;
      var facetValue = void 0;

      beforeEach(function () {
        props = _extends({}, defaultProps, {
          cssClasses: {
            item: 'item',
            link: 'link',
            active: 'active'
          },
          currency: '$'
        });
        facetValue = {
          from: 1,
          to: 10,
          isRefined: false,
          url: 'url'
        };
      });

      it('should display one range item correctly', function () {
        // Given
        var component = getComponentWithMockRendering(props);

        var tree = _reactTestRenderer2.default.create(component.getItemFromFacetValue(facetValue)).toJSON();
        expect(tree).toMatchSnapshot();
      });
      it('should display one active range item correctly', function () {
        // Given
        var component = getComponentWithMockRendering(props);
        facetValue.isRefined = true;

        var tree = _reactTestRenderer2.default.create(component.getItemFromFacetValue(facetValue)).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });

    describe('refine', function () {
      it('should call refine from props', function () {
        // Given
        var mockEvent = { preventDefault: _sinon2.default.spy() };
        var props = {
          refine: _sinon2.default.spy()
        };
        var component = getComponentWithMockRendering(props);

        // When
        component.refine({ from: 1, to: 10 }, mockEvent);

        // Then
        expect(mockEvent.preventDefault.called).toBe(true);
        expect(props.refine.calledWith({ from: 1, to: 10 })).toBe(true);
      });
    });

    describe('getForm', function () {
      it('should call the PriceRangesForm', function () {
        // Given
        var props = {
          cssClasses: {},
          labels: { button: 'hello' },
          currency: '$',
          refine: function refine() {},

          facetValues: [{ from: 0, to: 10 }, { from: 10, to: 20 }]
        };
        var component = getComponentWithMockRendering(props);
        var tree = _reactTestRenderer2.default.create(component.getForm()).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });

  describe('render', function () {
    it('should have the right number of items', function () {
      var props = _extends({}, defaultProps, {
        facetValues: [{ from: 0, to: 10 }, { from: 1, to: 10 }, { from: 2, to: 10 }, { from: 3, to: 10 }]
      });
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_PriceRanges.RawPriceRanges, props)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('should wrap the output in a list CSS class', function () {
      var props = _extends({}, defaultProps, {
        cssClasses: {
          list: 'list'
        },
        facetValues: [{ from: 0, to: 10 }, { from: 1, to: 10 }, { from: 2, to: 10 }, { from: 3, to: 10 }]
      });
      var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_PriceRanges.RawPriceRanges, props)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('starts a refine on click', function () {
      // Given
      var mockRefined = stubMethod('refine');
      var props = _extends({}, defaultProps, {
        facetValues: [{ from: 1, to: 10, isRefined: false }],
        templateProps: {
          templates: {
            item: 'item'
          }
        }
      });
      var component = _testUtils2.default.renderIntoDocument(_react2.default.createElement(_PriceRanges.RawPriceRanges, props));
      var link = _testUtils2.default.findRenderedDOMComponentWithTag(component, 'a');

      // When
      _testUtils2.default.Simulate.click(link);

      // Then
      expect(mockRefined.called).toBe(true);
    });
  });
});