var vows = require('vows'),
    assert = require('assert'),
    data = require('../lib/data.js');

vows.describe('Source').addBatch({
    'A source': {
        'from empty input': {
            topic: data.getSource(''),

            'is null': function (topic) {
                assert.equal(topic, null);
            }
        },
        'from null input': {
            topic: data.getSource(null),

            'is null': function (topic) {
                assert.equal(topic, null);
            }
        },
        'from undefined input': {
            topic: data.getSource(),

            'is null': function (topic) {
                assert.equal(topic, null);
            }
        },
        'from input without end marker token': {
            topic: data.getSource('{"title":"Title"}'),

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
        },
        'from input of just an end marker token': {
            topic: data.getSource('$end'),

            'does not throw': function() {
                assert.doesNotThrow(function() {
                    data.getSource('$end');
                });
            },
            'is null': function (topic) {
                assert.equal(topic, null);
            }
        }
    }
}).export(module);