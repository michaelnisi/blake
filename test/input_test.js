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

var vows = require('vows');
var assert = require('assert');
var input = require('../lib/input.js');
var config = require('../lib/config.js');
var paths = input.getPaths(config);

vows.describe('Date').addBatch({
	'A date string': {
		'from a valid Date': {
			topic: input.formatDate(new Date('2011-12-15')),
			'is formatted in a human readable form in American English': function (topic) {
				assert.strictEqual(topic, 'Thu Dec 15 2011');
			}
		},
		'from an uninitialized Date': {
			topic: input.formatDate(new Date(null)),
			'is formatted in a human readable form in American English': function (topic) {
				assert.strictEqual(topic, 'Thu Jan 01 1970');
			}
		},
		'from an invalid Date': {
			topic: input.formatDate(new Date(undefined)),
			'is Invalid Date': function (topic) {
				assert.strictEqual(topic, 'Invalid Date');
			}
		}
	}
}).export(module);


vows.describe('Source').addBatch({
	'Attempting to get source from input': {
		'without header': {
			'throws an error': function() {
				assert.throws(function() {
					input.getSource('');
				});
			}
		},
		'with header, but without template': {
			'throws an error': function() {
				assert.throws(function() {
					input.getSource('{ }\n$end\n', 'test', paths);
				});
			}
		},
		'with header and template': {
			'does not throw an error': function() {
				assert.doesNotThrow(function() {
					input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths);
				});
			}
		}
	},
	'Source from input header': {
		'without date': {
			topic: input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths),
			'has the current date': function(topic) {
				assert.strictEqual(topic.dateString, input.formatDate(new Date()));
			}
		},
		'without name': {
			topic: input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths),
			'has filename from name': function(topic) {
				assert.strictEqual(topic.name, 'file.html');
			}
		},
		'with template name': {
			topic: input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths),
			'has complete path to template file': function(topic) {
				assert.strictEqual(topic.templatePath, '/templates/name.jade');
			}
		}
	}
}).export(module);
