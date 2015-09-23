var blake = require('../')
var common = require('./lib/common')
var path = require('path')
var test = require('tap').test

var source = common.source(__dirname)
var target = common.freshTarget()
var b = blake(source, target)

test('read file', function (t) {
  var p = path.resolve(source, 'data', 'index.md')
  b.items(p, function (er, item) {
    if (er) throw er
    t.ok(item.header, 'should have header')
    t.ok(item.body, 'should have body')
    t.end()
  })
})

test('read directory', function (t) {
  var p = path.resolve(source, 'data')
  b.items(p, function (er, items) {
    if (er) throw er
    items.forEach(function (item) {
      t.ok(item.header, 'should have header')
      t.ok(item.body, 'should have body')
    })
    t.end()
  })
})
