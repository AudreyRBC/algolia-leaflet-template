'use strict';

var _defaultTemplates = require('../defaultTemplates.js');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('hits defaultTemplates', function () {
  it('has a `empty` default template', function () {
    expect(_defaultTemplates2.default.empty).toBe('No results');
  });

  it('has a `item` default template', function () {
    var item = {
      hello: 'there,',
      how: {
        are: 'you?'
      }
    };

    var expected = '{\n  "hello": "there,",\n  "how": {\n    "are": "you?"\n  }\n}';

    expect(_defaultTemplates2.default.item(item)).toBe(expected);
  });
});