var blake = require('../')
var common = require('./lib/common')
var cop = require('cop')
var es = require('event-stream')
var fstream = require('fstream')
var path = require('path')
var test = require('tap').test

var source = common.source(__dirname)
var target = common.freshTarget()

test('files', function (t) {
  var p = path.resolve(source, 'data')
  var s = blake.files(p)
  t.plan(1)
  s.on('data', function (chunk) {
    var wanted = path.resolve(p, 'index.md')
    t.is(chunk, wanted)
  })
})

test('read array of filenames', function (t) {
  var filenames = [path.join(source, 'data', 'index.md')]
  es.readArray(filenames)
    .pipe(blake(source, target))
    .pipe(es.writeArray(function (er, names) {
      if (er) throw er
      var wanted = [path.join(target, 'index.html')]
      t.is(names.length, wanted.length)
      t.deepEqual(names, wanted)
      t.end()
    }))
})

test('files written', function (t) {
  fstream.Reader({ path: target })
    .pipe(cop('path'))
    .pipe(es.writeArray(function (er, lines) {
      if (er) throw er
      var wanted = [path.join(target, 'index.html')]
      t.deepEqual(lines, wanted, 'should equal paths')
      t.end()
    }))
})
