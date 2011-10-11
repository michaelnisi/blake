/**
 * bake_test.js
 */

var vows = require('vows'),
    assert = require('assert'),
    bake = require('../lib/bake.js');

vows.describe('bake').addBatch({
    'when launched with no arguments': {
        topic: bake.main(),
        'we exit with -1':function(topic) {
            assert.equal(topic, -1);
        }
    },
    'when launched with just one argument': {
        topic: bake.main(['a']),
        'we exit with -1':function(topic) {
            assert.equal(topic, -1);
        }
    },
    'when launched with two arguments': {
        topic: bake.main(['path/to/input', 'path/to/output']),
        'we succeed':function(topic) {
            assert.equal(topic, 0);
        }
    }
}).export(module);
