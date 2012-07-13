var test = require('tap').test
  , copy = require('../lib/copy.js')
  , fs = require('fs')
  , rimraf = require('rimraf')
  , source = 'source/resources'
  , target = '/tmp/blake-test/resources'

test('directory', function (t) {
  copy(source, target, function (err) {
    t.ok(fs.statSync(target).isDirectory(), 'should be copied')
    t.end()
  })
})

test('teardown', function (t) {
  rimraf(target, function (err) {
    fs.stat(target, function (err) {
      t.ok(!!err, 'should error')
      t.end()
    })
  })
})

