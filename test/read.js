var test = require('tap').test
  , path = require('path')
  , reader = require('../lib/read.js')
  , config = require('./config.js')
  , props = config.props 
  , read = reader(props).read

test('read file', function (t) {
  read(path.join(props.paths.data, 'index.md'), function (err, item) {
    t.ok(item.header, 'should have header')
    t.ok(item.body, 'should have body')
    t.end()
  })
})

test('read directory', function (t) {
  t.end()
  
  read(props.paths.data, function (err, items) {
    items.forEach(function (item) {
      t.ok(item.header, 'should have header')
      t.ok(item.body, 'should have body')
    })
    t.end()
  })
})
