var test = require('tap').test
  , path = require('path')
  , read = require('../lib/read').readItems
  , config = require('./config')
  , props = config.props

test('read file', function (t) {
  var file = path.join(props.paths.data, 'index.md')
  read(props)(file, function (err, item) {
    t.ok(item.header, 'should have header')
    t.ok(item.body, 'should have body')
    t.end()
  })
})

test('read directory', function (t) {
  read(props)(props.paths.data, function (err, items) {
    items.forEach(function (item) {
      t.ok(item.header, 'should have header')
      t.ok(item.body, 'should have body')
    })
    t.end()
  })
})
