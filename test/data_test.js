var vows = require('vows'),
    assert = require('assert'),
    data = require('../lib/data.js');

vows.describe('Source').addBatch({
    'A source': {
        'from input without end marker token': {
            topic: data.getSource('{"title":"Title"}', 'filename', {}),

            'does not throw': function() {
                assert.doesNotThrow(function() {
                    data.getSource('{}');
                });
            },
            'has a correct header': function (topic) {
                assert.ok(topic.header);
                assert.strictEqual(topic.header.title, "Title");
                assert.equal(topic.body, undefined);
            }
        }
    }
}).export(module);

vows.describe('Articles').addBatch({
    'A string': {
        'starting with an international standard date (YYYY-MM-DD)': {
            topic: data.isArticleName('2011-11-11_hello.markdown'),

            'is an article name': function (topic) {
                assert.ok(topic);
            }
        },
        'starting with without an international standard date (YYYY-MM-DD)': {
            topic: data.isArticleName('hello.markdown'),

            'is not an article name': function (topic) {
                assert.ok(!topic);
            }
        }
    }
}).export(module);