var test = require('tap').test;
var input = require('../lib/input.js');

var config
var end;
var paths;

test('setup', function (t) {
  config = {
    paths: {
      data: '/data',
      templates: '/templates/',
      resources: '/resources/',
      posts: '/data/posts'
    }
  };

  end = '\n\n';
  paths = input.getPaths(config);

  t.end();
});

test('A date string from a valid Date', function (t) {
  t.same(input.formatDate(new Date('2011-12-15')), 
         'Thu Dec 15 2011', 
         'should be formatted to a human readable form in American English');

  t.end();
});

test('A date string from an uninitialized Date', function (t) {
  t.same(input.formatDate(new Date(null)),
         'Thu Jan 01 1970',
         'should be formatted to a human readable form in American English');

  t.end();
});

test('A date string from an invalid Date', function (t) {
  t.same(input.formatDate(new Date(undefined)), 
         'Invalid Date',
         'should be "Invalid Date"');
 
  t.end();
});

test('Get source from input without header', function (t) {
  t.throws(function () {
    input.getSource('');
  }, 'should throw an error');

  t.end();
});

test('Get source from input with header, but without template', function (t) {
  t.throws(function () {
    input.getSource('{ }'.concat(end), 'test', paths);
  }, 'should throw an error');

  t.end();
});

test('Get source from input with header and template', function (t) {
  t.doesNotThrow(function () {
    input.getSource('{ "template":"name.jade" }'.concat(end), 
                    'path/to/file.md', paths);
  }, 'shoud not throw an error');

  t.end();
});

test('teardown', function (t) {
  config = null;
  end = null;
  paths = null;

  t.end();
});


