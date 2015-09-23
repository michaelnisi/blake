var cop = require('cop')
var copy = require('../').copy
var es = require('event-stream')
var fs = require('fs')
var fstream = require('fstream')
var rimraf = require('rimraf')
var path = require('path')
var test = require('tap').test
var common = require('./lib/common')

var source = common.source(__dirname, 'resources')
var target = common.freshTarget()

function paths (p, cb) {
  return fstream.Reader({ path: p })
    .pipe(cop('path'))
    .pipe(es.writeArray(cb))
}

test('directory', function (t) {
  copy(source, target, function (er) {
    if (er) throw er
    t.ok(fs.statSync(target).isDirectory(), 'should exist')
    var wanted = [
      path.join(target, 'bye'),
      path.join(target, 'hello')
    ]
    wanted.forEach(function (p) {
      t.ok(fs.statSync(p), 'should exist')
    })
    paths(target, function (er, found) {
      if (er) throw er
      t.deepEqual(found, wanted, 'should have copied all files')
      t.end()
    })
  })
})

test('teardown', function (t) {
  rimraf(target, function (er) {
    if (er) throw er
    t.end()
  })
})
