var blake = require('../')
var common = require('./lib/common')
var path = require('path')
var readFileSync = require('fs').readFileSync
var string_decoder = require('string_decoder')
var test = require('tap').test

var source = common.source(__dirname)
var target = common.freshTarget()
var config = blake.conf(source, target)
var paths = config.paths

test('header', function (t) {
  var f = blake.header
  var file = path.join(paths.data, 'index.md')
  t.throws(function () {
    f(null, file, paths)
  })
  t.throws(function () {
    var data = '{"title":"Title"}'
    f(data, file, paths)
  })
  t.doesNotThrow(function () {
    var data = '{"template":"x", "name":"y"}'
    f(data, file, paths)
  })
  t.end()
})

test('item', function (t) {
  var filename = path.join(paths.data, 'index.md')
  var buf = readFileSync(filename)
  var str = new string_decoder.StringDecoder().write(buf)

  var it = blake.item(config, filename, str)

  var h = it.header
  t.equal(h.template, 'index.jade')
  t.equal(h.name, 'index.html')
  t.equal(h.title, null)
  t.ok(h.date instanceof Date, 'should be instance of Date')
  t.equal(h.path, '')

  t.ok(it.body.length, 'should have body')
  t.equal(it.title, null)
  t.equal(it.name, 'index.html')
  t.same(it.date, h.date)
  t.equal(it.title, h.title)
  t.equal(it.link, 'index.html')
  t.ok(typeof it.view === 'function', 'should be function type')
  t.equal(it.name, 'index.html')
  t.equal(it.path, path.join(target, h.name))

  t.end()
})
