var test = require('tap').test
  , reader = require('../lib/read.js')
  , props = require('./props.js')
  , read = reader(props).read

test('file', function (t) {
  read('source/data/about.md', function (err, item) {
    t.ok(item.header, 'should have header')
    t.ok(item.body, 'should have body')
    t.end()
  })
})

test('directory', function (t) {
  read('source/data/posts', function (err, items) {
    items.forEach(function (item) {
      t.ok(item.header, 'should have header')
      t.ok(item.body, 'should have body')
    })
    t.end()
  })
})
