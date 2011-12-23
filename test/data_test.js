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

var vows = require('vows'), assert = require('assert'), data = require('../lib/input.js');

vows.describe('Date').addBatch({
    'A date string': {
        'from a valid Date': {
            topic: data.formatDate(new Date('2011-12-15')),
            'is formatted in a human readable form in American English': function (topic) {
                assert.strictEqual(topic, 'Thu Dec 15 2011');
            }
        },
        'from an uninitialized Date': {
            topic: data.formatDate(new Date(null)),
            'is formatted in a human readable form in American English': function (topic) {
                assert.strictEqual(topic, 'Thu Jan 01 1970');
            }
        },
        'from an invalid Date': {
            topic: data.formatDate(new Date(undefined)),
            'is Invalid Date': function (topic) {
                assert.strictEqual(topic, 'Invalid Date');
            }
        }
    }
}).export(module);


vows.describe('Source').addBatch({
    'Attempting to get source from input': {
        'without header': {
            'throws an error':function() {
                assert.throws(function() {
                    data.getSource('');
                });
            }
        }
    }
}).export(module);