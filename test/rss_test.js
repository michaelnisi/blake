/*
 * Copyright (C) 2011 by Michael Nisi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var vows = require('vows'),
    assert = require('assert'),
    rss = require('../lib/rss.js');

vows.describe('Item').addBatch({
    'An item': {
        'from correct input': {
            topic: rss.getItem('2011-11-11_hello.markdown', '{"title":"Title"}$end##Title\n\nThe content ...'),

            'has a title': function (topic) {
                assert.strictEqual(topic.title, 'Title');
            },
            'has a date extracted from the filename': function (topic) {
                assert.strictEqual(topic.date, 'Thu, 10 Nov 2011 23:00:00 GMT');
            }
        }
    },
    'An item body': {
        'with from an item with headline': {
            topic: rss.formatItemBody('##Title\n\nThe content ...'),

            'has no headline': function(topic) {
                assert.strictEqual(topic, 'The content ...');
            }
        }
    }
}).export(module);