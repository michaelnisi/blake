/**
 * rss_test.js
 */

var vows = require('vows'),
    assert = require('assert'),
    rss = require('../lib/rss.js');

vows.describe('rss').addBatch({
    'when we bake': {
        topic: function() {
            console.time('RSS baked');
            rss.bake('../input/templates/rss.jade', '../input/articles', '../output', this.callback)
        },
        'we succeed':function(err, data) {
            assert.isNull(err);
            assert.ok(data)
           console.timeEnd('RSS baked');
        }
    }
}).export(module);



