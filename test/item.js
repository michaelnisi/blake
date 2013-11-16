var test = require('tap').test
  , getItem = require('../lib/item.js')
  , strftime = require('prettydate').strftime
  , path = require('path')
  , readFileSync = require('fs').readFileSync
  , config = require('./config.js')
  , target = config.target
  , props = config.props
  , paths = props.paths

test('read', function (t) {
  var filename = path.join(paths.data, 'index.md')
    , file = readFileSync(filename)
    , item = getItem(props, filename, file.toString())
    , header = item.header

  t.equal(header.template, 'index.jade')
  t.equal(header.name, 'index.html')
  t.equal(header.title, null)
  t.ok(header.date instanceof Date, 'should be instance of Date')
  t.equal(header.path, '')

  t.ok(item.body.length, 'should have body')
  t.equal(item.title, null)
  t.equal(item.name, 'index.html')
  t.same(item.date, header.date)
  t.equal(item.pubDate, strftime(header.date, '%a, %d %b %Y %T %z'))
  t.equal(item.dateString, header.date.toDateString())
  t.ok(item.template instanceof Buffer, 'should be instance of Buffer')
  t.equal(item.title, header.title)
  t.equal(item.link, 'index.html')
  t.ok(typeof item.bake === 'function', 'should be function type')
  t.equal(item.name, 'index.html')
  t.equal(item.path, path.join(target, header.name))

  t.end()
})
