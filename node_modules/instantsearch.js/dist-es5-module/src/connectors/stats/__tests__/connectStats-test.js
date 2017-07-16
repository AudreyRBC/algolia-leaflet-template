'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectStats = require('../connectStats.js');

var _connectStats2 = _interopRequireDefault(_connectStats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectStats', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectStats2.default)(rendering);

    var widget = makeWidget({
      foo: 'bar' // dummy param to test `widgetParams`
    });

    expect(widget.getConfiguration).toEqual(undefined);

    var helper = (0, _algoliasearchHelper2.default)(fakeClient);
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
          hitsPerPage = _rendering$lastCall$a.hitsPerPage,
          nbHits = _rendering$lastCall$a.nbHits,
          nbPages = _rendering$lastCall$a.nbPages,
          page = _rendering$lastCall$a.page,
          processingTimeMS = _rendering$lastCall$a.processingTimeMS,
          query = _rendering$lastCall$a.query,
          widgetParams = _rendering$lastCall$a.widgetParams;

      expect(hitsPerPage).toBe(helper.state.hitsPerPage);
      expect(nbHits).toBe(0);
      expect(nbPages).toBe(0);
      expect(page).toBe(helper.state.page);
      expect(processingTimeMS).toBe(-1);
      expect(query).toBe(helper.state.query);
      expect(widgetParams).toEqual({ foo: 'bar' });
    }

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: [{ One: 'record' }],
        nbPages: 1,
        nbHits: 1,
        hitsPerPage: helper.state.hitsPerPage,
        page: helper.state.page,
        query: helper.state.query,
        processingTimeMS: 12
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
      var _rendering$lastCall$a2 = rendering.lastCall.args[0],
          _hitsPerPage = _rendering$lastCall$a2.hitsPerPage,
          _nbHits = _rendering$lastCall$a2.nbHits,
          _nbPages = _rendering$lastCall$a2.nbPages,
          _page = _rendering$lastCall$a2.page,
          _processingTimeMS = _rendering$lastCall$a2.processingTimeMS,
          _query = _rendering$lastCall$a2.query;

      expect(_hitsPerPage).toBe(helper.state.hitsPerPage);
      expect(_nbHits).toBe(1);
      expect(_nbPages).toBe(1);
      expect(_page).toBe(helper.state.page);
      expect(_processingTimeMS).toBe(12);
      expect(_query).toBe(helper.state.query);
    }
  });
});