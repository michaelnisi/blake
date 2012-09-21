var test = require('tap').test
  , blake  = require('../lib/blake.js')
  , resolve = require('path').resolve
  , rimraf = require('rimraf')
  , fs = require('fs')
  , source = 'source'
  , target = '/tmp/blake-test'

test('all', function (t) {
  t.end()
})

test('specified', function (t) {
  var fileA = resolve(source, 'data', 'about.md')
         
  blake(source, target, fileA, function (err, res) {
    var a = resolve(target, 'about.html')
    t.ok(fs.statSync(a).isFile(), 'should be written')
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


