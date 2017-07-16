'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectPriceRanges = require('../connectPriceRanges.js');

var _connectPriceRanges2 = _interopRequireDefault(_connectPriceRanges);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectPriceRanges', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectPriceRanges2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({
      attributeName: attributeName
    });

    // does not have a getConfiguration method
    var config = widget.getConfiguration();
    expect(config).toEqual({ facets: [attributeName] });

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
      var items = rendering.lastCall.args[0].items;

      expect(items).toEqual([]);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [{ test: 'oneTime' }],
        facets: { price: { 10: 1, 20: 1, 30: 1 } },
        facets_stats: { // eslint-disable-line
          price: {
            avg: 20,
            max: 30,
            min: 10,
            sum: 60
          }
        },
        nbHits: 1,
        nbPages: 1,
        page: 0
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

      // should provide good values for the first rendering
      var _rendering$lastCall$a = rendering.lastCall.args[0],
          _items = _rendering$lastCall$a.items,
          widgetParams = _rendering$lastCall$a.widgetParams;

      expect(_items).toEqual([{ to: 10, url: '#' }, { from: 10, to: 13, url: '#' }, { from: 13, to: 16, url: '#' }, { from: 16, to: 19, url: '#' }, { from: 19, to: 22, url: '#' }, { from: 22, to: 25, url: '#' }, { from: 25, to: 28, url: '#' }, { from: 28, url: '#' }]);
      expect(widgetParams).toEqual({
        attributeName: attributeName
      });
    }
  });

  it('Provides a function to update the refinements at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectPriceRanges2.default)(rendering);

    var attributeName = 'price';
    var widget = makeWidget({
      attributeName: attributeName
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
      expect(helper.getNumericRefinement('price', '>=')).toEqual(undefined);
      expect(helper.getNumericRefinement('price', '<=')).toEqual(undefined);
      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine;

      refine({ from: 10, to: 30 });
      expect(helper.getNumericRefinement('price', '>=')).toEqual([10]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([30]);
      expect(helper.search.callCount).toBe(1);
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [{ test: 'oneTime' }],
        facets: { price: { 10: 1, 20: 1, 30: 1 } },
        facets_stats: { // eslint-disable-line
          price: {
            avg: 20,
            max: 30,
            min: 10,
            sum: 60
          }
        },
        nbHits: 1,
        nbPages: 1,
        page: 0
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      expect(helper.getNumericRefinement('price', '>=')).toEqual([10]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([30]);
      var _renderOptions = rendering.lastCall.args[0];
      var _refine = _renderOptions.refine;

      _refine({ from: 40, to: 50 });
      expect(helper.getNumericRefinement('price', '>=')).toEqual([40]);
      expect(helper.getNumericRefinement('price', '<=')).toEqual([50]);
      expect(helper.search.callCount).toBe(2);
    }
  });
});