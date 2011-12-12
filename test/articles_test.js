var vows = require('vows'),
    assert = require('assert'),
    articles = require('../lib/article.js');

function getSource() {
    var paths, src;

    paths = {};
    paths.outputPathName = 'output';

    src = {};
    src.filename = '2011-11-11_hello.markdown';
    src.paths = paths;

    return src;
}

vows.describe('Path').addBatch({
    'A path': {
        'from expected input': {
            topic: articles.getPath(getSource()),

            'resolves to a correct path': function (topic) {
                assert.strictEqual(topic, 'output/2011/11/11/hello');
            }
        }
    }
}).export(module);