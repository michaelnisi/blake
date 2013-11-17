var test = require('tap').test
  , item = require('../lib/item').item
  , header = require('../lib/item').header
  , strftime = require('prettydate').strftime
  , path = require('path')
  , readFileSync = require('fs').readFileSync
  , config = require('./config.js')
  , target = config.target
  , props = config.props
  , paths = props.paths

test('header', function (t) {
  var file = path.join(paths.data, 'index.md')
  t.throws(function () {
    header(null, file, paths)
  })
  t.throws(function () {
    var data = '{"title":"Title"}'
    header(data, file, paths)
  })
  t.doesNotThrow(function () {
    var data = '{"template":"x", "name":"y"}'
    header(data, file, paths)
  })
  t.end()
})

test('item', function (t) {
  var filename = path.join(paths.data, 'index.md')
    , file = readFileSync(filename)
    , it = item(props, filename, file.toString())

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
  t.equal(it.pubDate, strftime(h.date, '%a, %d %b %Y %T %z'))
  t.equal(it.dateString, h.date.toDateString())
  t.ok(it.template instanceof Buffer, 'should be instance of Buffer')
  t.equal(it.title, h.title)
  t.equal(it.link, 'index.html')
  t.ok(typeof it.bake === 'function', 'should be function type')
  t.equal(it.name, 'index.html')
  t.equal(it.path, path.join(target, h.name))

  t.end()
})
