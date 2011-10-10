/**
 * transformer_test.js
 */

var vows = require('vows'),
    assert = require('assert'),
    transformer = require('../lib/transformer.js');

vows.describe('transformer').addBatch({
    'when the input file contains multiple lines': {
        topic: transformer.getHeader('title: An article\nsummary: This is an article\npath: 2011/10/article\n'),
        'names and values are mapped correctly':function(topic) {
            assert.equal(topic.title, 'An article');
            assert.equal(topic.summary, 'This is an article');
            assert.equal(topic.path, '2011/10/article');
        }
    },
    'when the input file contains just one line': {
        topic: transformer.getHeader('title: An article\n'),
        'the one name value pair is correct':function(topic) {
            assert.equal(topic.title, 'An article');
        }
    },
    'when the input file is empty': {
        topic: transformer.getHeader(''),
        'no names and values are set':function(topic) {
            assert.equal(topic.title, undefined);
        }
    },
    'when the input file contains just a single line break': {
        topic: transformer.getHeader('\n'),
        'no exception is thrown':function(topic) {
            assert.equal(topic.title, undefined);
        }
    }
}).export(module);

