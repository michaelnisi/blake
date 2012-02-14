// Tests for the input module, which is mainly about interpreting the headers
// (everything before '$end') of the input files.

var vows = require('vows');
var assert = require('assert');
var input = require('../lib/input.js');

var config = {
  paths: {
    data: '/data',
    templates: '/templates/',
    resources: '/resources/',
    posts: '/data/posts'
  }
};

var paths = input.getPaths(config);

vows.describe('Date').addBatch({
	'A date string': {
		'from a valid Date': {
			topic: input.formatDate(new Date('2011-12-15')),
			'should be formatted in a human readable form in American English': function (topic) {
				assert.strictEqual(topic, 'Thu Dec 15 2011');
			}
		},
		'from an uninitialized Date': {
			topic: input.formatDate(new Date(null)),
			'should be formatted in a human readable form in American English': function (topic) {
				assert.strictEqual(topic, 'Thu Jan 01 1970');
			}
		},
		'from an invalid Date': {
			topic: input.formatDate(new Date(undefined)),
			'should be "Invalid Date"': function (topic) {
				assert.strictEqual(topic, 'Invalid Date');
			}
		}
	}
}).export(module);

vows.describe('Source').addBatch({
	'Attempting to get source from input': {
		'without header': {
			'should throw an error': function() {
				assert.throws(function() {
					input.getSource('');
				});
			}
		},
		'with header, but without template': {
			'should throw an error': function() {
				assert.throws(function() {
					input.getSource('{ }\n$end\n', 'test', paths);
				});
			}
		},
		'with header and template': {
			'should not throw an error': function() {
				assert.doesNotThrow(function() {
					input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths);
				});
			}
		}
	},
	'Source from input with header': {
		'without date': {
			topic: input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths),
			'should have the current date': function(topic) {
				assert.strictEqual(topic.dateString, input.formatDate(new Date()));
			}
		},
		'without name': {
			topic: input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths),
			'should have filename from input file name': function(topic) {
				assert.strictEqual(topic.name, 'file.html');
			}
		},
		'with template name': {
			topic: input.getSource('{ "template":"name.jade" }\n$end\n', 'path/to/file.md', paths),
			'should have complete path to template file': function(topic) {
				assert.strictEqual(topic.templatePath, '/templates/name.jade');
			}
		},
        'without path': {
            topic: input.getSource('{ "template":"name.jade" }\n$end\n', '/data/posts/path/to/file.md', paths),
            'should have path from input filename': function(topic) {
				assert.strictEqual(topic.path, '/path/to');
			},
            'should have the correct link': function(topic) {
				assert.strictEqual(topic.link, '/path/to/file');
			}
        },
        'with path': {
            topic: input.getSource('{ "template":"name.jade", "path":"/path/to" }\n$end\n', 'path/to/file.md', paths),
			'should have the correct link': function(topic) {
				assert.strictEqual(topic.link, '/path/to/file');
			},
            'should have the correct path': function(topic) {
				assert.strictEqual(topic.path, '/path/to');
			}
        }
	}
}).export(module);
