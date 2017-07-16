'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectToggle = require('../connectToggle.js');

var _connectToggle2 = _interopRequireDefault(_connectToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectToggle', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectToggle2.default)(rendering);

    var attributeName = 'isShippingFree';
    var label = 'Free shipping?';
    var widget = makeWidget({
      attributeName: attributeName,
      label: label
    });

    var config = widget.getConfiguration();
    expect(config).toEqual({
      disjunctiveFacets: [attributeName]
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', config);
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    {
      // should call the rendering once with isFirstRendering to true
      expect(rendering.callCount).toBe(1);
      var isFirstRendering = rendering.lastCall.args[1];
      expect(isFirstRendering).toBe(true);

      // should provide good values for the first rendering
      var _rendering$lastCall$a = rendering.lastCall.args[0],
          value = _rendering$lastCall$a.value,
          widgetParams = _rendering$lastCall$a.widgetParams;

      expect(value).toEqual({
        name: label,
        count: null,
        isRefined: false,
        onFacetValue: {
          name: label,
          isRefined: false,
          count: 0
        },
        offFacetValue: {
          name: label,
          isRefined: false,
          count: 0
        }
      });

      expect(widgetParams).toEqual({
        attributeName: attributeName,
        label: label
      });
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: {
          isShippingFree: {
            'true': 45, // eslint-disable-line
            'false': 40 // eslint-disable-line
          }
        },
        nbHits: 85
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Should call the rendering a second time, with isFirstRendering to false
      expect(rendering.callCount).toBe(2);
      var _isFirstRendering = rendering.lastCall.args[1];
      expect(_isFirstRendering).toBe(false);

      // should provide good values after the first search
      var _value = rendering.lastCall.args[0].value;

      expect(_value).toEqual({
        name: label,
        count: 45,
        isRefined: false,
        onFacetValue: {
          name: label,
          isRefined: false,
          count: 45
        },
        offFacetValue: {
          name: label,
          isRefined: false,
          count: 85
        }
      });
    }
  });

  it('Provides a function to add/remove a facet value', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectToggle2.default)(rendering);

    var attributeName = 'isShippingFree';
    var label = 'Free shipping?';
    var widget = makeWidget({
      attributeName: attributeName,
      label: label
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration());
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    {
      // first rendering
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(undefined);
      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine,
          value = renderOptions.value;

      expect(value).toEqual({
        name: label,
        count: null,
        isRefined: false,
        onFacetValue: {
          name: label,
          isRefined: false,
          count: 0
        },
        offFacetValue: {
          name: label,
          isRefined: false,
          count: 0
        }
      });
      refine({ isRefined: value.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['true']);
      refine({ isRefined: !value.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(undefined);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: {
          isShippingFree: {
            'true': 45, // eslint-disable-line
            'false': 40 // eslint-disable-line
          }
        },
        nbHits: 85
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(undefined);
      var _renderOptions = rendering.lastCall.args[0];
      var _refine = _renderOptions.refine,
          _value2 = _renderOptions.value;

      expect(_value2).toEqual({
        name: label,
        count: 45,
        isRefined: false,
        onFacetValue: {
          name: label,
          isRefined: false,
          count: 45
        },
        offFacetValue: {
          name: label,
          isRefined: false,
          count: 85
        }
      });
      _refine({ isRefined: _value2.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['true']);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: {
          isShippingFree: {
            'true': 45 // eslint-disable-line
          }
        },
        nbHits: 85
      }, {
        facets: {
          isShippingFree: {
            'true': 45, // eslint-disable-line
            'false': 40 // eslint-disable-line
          }
        },
        nbHits: 85
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Third rendering
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['true']);
      var _renderOptions2 = rendering.lastCall.args[0];
      var _refine2 = _renderOptions2.refine,
          _value3 = _renderOptions2.value;

      expect(_value3).toEqual({
        name: label,
        count: 85,
        isRefined: true,
        onFacetValue: {
          name: label,
          isRefined: true,
          count: 45
        },
        offFacetValue: {
          name: label,
          isRefined: false,
          count: 85
        }
      });
      _refine2(_value3);
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(undefined);
    }
  });

  it('Provides a function to toggle between two values', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectToggle2.default)(rendering);

    var attributeName = 'isShippingFree';
    var label = 'Free shipping?';
    var widget = makeWidget({
      attributeName: attributeName,
      label: label,
      values: {
        on: 'true',
        off: 'false'
      }
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', widget.getConfiguration());
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    {
      // first rendering
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['false']);
      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine,
          value = renderOptions.value;


      expect(value).toEqual({
        name: label,
        count: null,
        isRefined: false,
        onFacetValue: {
          name: label,
          isRefined: false,
          count: 0
        },
        offFacetValue: {
          name: label,
          isRefined: true,
          count: 0
        }
      });
      refine({ isRefined: value.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['true']);
      refine({ isRefined: !value.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['false']);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: {
          isShippingFree: {
            'false': 40 // eslint-disable-line
          }
        },
        nbHits: 40
      }, {
        facets: {
          isShippingFree: {
            'true': 45, // eslint-disable-line
            'false': 40 // eslint-disable-line
          }
        },
        nbHits: 85
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['false']);
      var _renderOptions3 = rendering.lastCall.args[0];
      var _refine3 = _renderOptions3.refine,
          _value4 = _renderOptions3.value;

      expect(_value4).toEqual({
        name: label,
        // the value is the one that is not selected
        count: 45,
        isRefined: false,
        onFacetValue: {
          name: label,
          isRefined: false,
          count: 45
        },
        offFacetValue: {
          name: label,
          isRefined: true,
          count: 40
        }
      });
      _refine3({ isRefined: _value4.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['true']);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        facets: {
          isShippingFree: {
            'true': 45 // eslint-disable-line
          }
        },
        nbHits: 85
      }, {
        facets: {
          isShippingFree: {
            'true': 45, // eslint-disable-line
            'false': 40 // eslint-disable-line
          }
        },
        nbHits: 85
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Third rendering
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['true']);
      var _renderOptions4 = rendering.lastCall.args[0];
      var _refine4 = _renderOptions4.refine,
          _value5 = _renderOptions4.value;

      expect(_value5).toEqual({
        name: label,
        count: 40,
        isRefined: true,
        onFacetValue: {
          name: label,
          isRefined: true,
          count: 45
        },
        offFacetValue: {
          name: label,
          isRefined: false,
          count: 40
        }
      });
      _refine4({ isRefined: _value5.isRefined });
      expect(helper.state.disjunctiveFacetsRefinements[attributeName]).toEqual(['false']);
    }
  });
});