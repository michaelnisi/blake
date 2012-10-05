var test = require('tap').test
  , write = require('../lib/write.js')
  , fs = require('fs')
  , rimraf = require('rimraf')
  , source = '../example/blake-site/resources'
  , target = '/tmp/blake-test/say/my/name.txt'

test('write', function (t) {
  write(target, 'blake', function (err) {
    t.ok(fs.statSync(target).isFile(), 'should exist')
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
