var vows = require('vows'),
    assert = require('assert'),
    articles = require('../lib/articles.js');

vows.describe('Path').addBatch({
    'A path': {
        'from expected input': {
            topic: articles.getPath({paths:{outputPathName:'output'}, filename:'2011-11-11_hello.markdown'}),

            'resolves to a correct path': function (topic) {
                assert.strictEqual(topic, 'output/2011/11/11/hello');
            }
        }
    }
}).export(module);