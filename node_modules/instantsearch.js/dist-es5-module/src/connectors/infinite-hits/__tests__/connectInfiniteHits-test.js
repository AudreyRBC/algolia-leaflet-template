'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _connectInfiniteHits = require('../connectInfiniteHits.js');

var _connectInfiniteHits2 = _interopRequireDefault(_connectInfiniteHits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchResults = _algoliasearchHelper2.default.SearchResults;

var fakeClient = { addAlgoliaAgent: function addAlgoliaAgent() {} };

describe('connectInfiniteHits', function () {
  it('Renders during init and render', function () {
    // test that the dummyRendering is called with the isFirstRendering
    // flag set accordingly
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectInfiniteHits2.default)(rendering);
    var widget = makeWidget({
      escapeHits: true,
      hitsPerPage: 10
    });

    expect(widget.getConfiguration()).toEqual({
      highlightPostTag: '__/ais-highlight__',
      highlightPreTag: '__ais-highlight__'
    });

    // test if widget is not rendered yet at this point
    expect(rendering.callCount).toBe(0);

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '');
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    // test that rendering has been called during init with isFirstRendering = true
    expect(rendering.callCount).toBe(1);
    // test if isFirstRendering is true during init
    expect(rendering.lastCall.args[1]).toBe(true);
    expect(rendering.lastCall.args[0].widgetParams).toEqual({
      escapeHits: true,
      hitsPerPage: 10
    });

    widget.render({
      results: new SearchResults(helper.state, [{
        hits: []
      }]),
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    // test that rendering has been called during init with isFirstRendering = false
    expect(rendering.callCount).toBe(2);
    expect(rendering.lastCall.args[1]).toBe(false);
    expect(rendering.lastCall.args[0].widgetParams).toEqual({
      escapeHits: true,
      hitsPerPage: 10
    });
  });

  it('Provides the hits and the whole results', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectInfiniteHits2.default)(rendering);
    var widget = makeWidget();

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {});
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.lastCall.args[0];
    expect(firstRenderingOptions.hits).toEqual([]);
    expect(firstRenderingOptions.results).toBe(undefined);

    var hits = [{ fake: 'data' }, { sample: 'infos' }];
    var results = new SearchResults(helper.state, [{ hits: hits }]);
    widget.render({
      results: results,
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var secondRenderingOptions = rendering.lastCall.args[0];
    var showMore = secondRenderingOptions.showMore;

    expect(secondRenderingOptions.hits).toEqual(hits);
    expect(secondRenderingOptions.results).toEqual(results);
    showMore();
    expect(helper.search.callCount).toBe(1);

    // the results should accumulate if there is an increment in page
    var otherHits = [{ fake: 'data 2' }, { sample: 'infos 2' }];
    var otherResults = new SearchResults(helper.state, [{
      hits: otherHits
    }]);
    widget.render({
      results: otherResults,
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var thirdRenderingOptions = rendering.lastCall.args[0];
    expect(thirdRenderingOptions.hits).toEqual([].concat(hits, otherHits));
    expect(thirdRenderingOptions.results).toEqual(otherResults);

    helper.setPage(0);

    // If the page goes back to 0, the hits cache should be flushed

    var thirdHits = [{ fake: 'data 3' }, { sample: 'infos 3' }];
    var thirdResults = new SearchResults(helper.state, [{
      hits: thirdHits
    }]);
    widget.render({
      results: thirdResults,
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var fourthRenderingOptions = rendering.lastCall.args[0];
    expect(fourthRenderingOptions.hits).toEqual(thirdHits);
    expect(fourthRenderingOptions.results).toEqual(thirdResults);
  });

  it('escape highlight properties if requested', function () {
    var rendering = _sinon2.default.stub();
    var makeWidget = (0, _connectInfiniteHits2.default)(rendering);
    var widget = makeWidget({ escapeHits: true });

    var helper = (0, _algoliasearchHelper2.default)(fakeClient, '', {});
    helper.search = _sinon2.default.stub();

    widget.init({
      helper: helper,
      state: helper.state,
      createURL: function createURL() {
        return '#';
      },
      onHistoryChange: function onHistoryChange() {}
    });

    var firstRenderingOptions = rendering.lastCall.args[0];
    expect(firstRenderingOptions.hits).toEqual([]);
    expect(firstRenderingOptions.results).toBe(undefined);

    var hits = [{
      _highlightResult: {
        foobar: {
          value: '<script>__ais-highlight__foobar__/ais-highlight__</script>'
        }
      }
    }];

    var results = new SearchResults(helper.state, [{ hits: hits }]);
    widget.render({
      results: results,
      state: helper.state,
      helper: helper,
      createURL: function createURL() {
        return '#';
      }
    });

    var escapedHits = [{
      _highlightResult: {
        foobar: {
          value: '&lt;script&gt;<em>foobar</em>&lt;/script&gt;'
        }
      }
    }];

    var secondRenderingOptions = rendering.lastCall.args[0];
    expect(secondRenderingOptions.hits).toEqual(escapedHits);
    expect(secondRenderingOptions.results).toEqual(results);
  });
});