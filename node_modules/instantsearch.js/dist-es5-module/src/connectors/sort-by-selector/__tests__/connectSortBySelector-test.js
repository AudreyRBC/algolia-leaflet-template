'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectSortBySelector = require('../connectSortBySelector.js');

var _connectSortBySelector2 = _interopRequireDefault(_connectSortBySelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectSortBySelector', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectSortBySelector2.default)(rendering);

    var indices = [{ label: 'Sort products by relevance', name: 'relevance' }, { label: 'Sort products by price', name: 'priceASC' }];
    var widget = makeWidget({ indices: indices });

    expect(widget.getConfiguration).toBe(undefined);

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, indices[0].name);
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
          currentRefinement = _rendering$lastCall$a.currentRefinement,
          options = _rendering$lastCall$a.options,
          widgetParams = _rendering$lastCall$a.widgetParams;

      expect(currentRefinement).toBe(helper.state.index);
      expect(widgetParams).toEqual({ indices: indices });
      expect(options).toEqual([{ label: 'Sort products by relevance', value: 'relevance' }, { label: 'Sort products by price', value: 'priceASC' }]);
    }

    widget.render({
      results: new SearchResults(helper.state, [{}]),
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
      var _rendering$lastCall$a2 = rendering.lastCall.args[0],
          _currentRefinement = _rendering$lastCall$a2.currentRefinement,
          _options = _rendering$lastCall$a2.options;

      expect(_currentRefinement).toBe(helper.state.index);
      expect(_options).toEqual([{ label: 'Sort products by relevance', value: 'relevance' }, { label: 'Sort products by price', value: 'priceASC' }]);
    }
  });

  it('Provides a function to update the index at each step', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectSortBySelector2.default)(rendering);

    var indices = [{ label: 'Sort products by relevance', name: 'relevance' }, { label: 'Sort products by price', name: 'priceASC' }];
    var widget = makeWidget({
      indices: indices
    });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, indices[0].name);
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
      expect(helper.state.index).toBe(indices[0].name);
      var renderOptions = rendering.lastCall.args[0];
      var refine = renderOptions.refine,
          currentRefinement = renderOptions.currentRefinement;

      expect(currentRefinement).toBe(helper.state.index);
      refine('bip');
      expect(helper.state.index).toBe('bip');
      expect(helper.search.callCount).toBe(1);
    }

    widget.render({
      results: new SearchResults(helper.state, [{}]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    {
      // Second rendering
      expect(helper.state.index).toBe('bip');
      var _renderOptions = rendering.lastCall.args[0];
      var _refine = _renderOptions.refine,
          _currentRefinement2 = _renderOptions.currentRefinement;

      expect(_currentRefinement2).toBe('bip');
      _refine('bop');
      expect(helper.state.index).toBe('bop');
      expect(helper.search.callCount).toBe(2);
    }
  });
});