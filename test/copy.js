var test = require('tap').test
  , copy = require('../lib/copy.js')
  , join = require('path').join
  , fs = require('fs')
  , rimraf = require('rimraf')
  , source = '../example/blake-site/resources'
  , target = '/tmp/blake-' + Math.floor(Math.random() * (1<<24))
  , fstream = require('fstream')
  , es = require('event-stream')
  , cop = require('cop')

test('directory', function (t) {
  copy(source, target, function (err) {
    var paths = [
      join(target, 'css', 'style.css')
    , join(target, 'img', 'bg.png')
    ]

    t.ok(fs.statSync(target).isDirectory(), 'should exist')
    paths.forEach(function (p) {
      t.ok(fs.statSync(p), 'should exist')
    })

    fstream.Reader({ path:target })
      .pipe(cop('path'))
      .pipe(es.writeArray(function (err, lines) {
        t.deepEqual(lines, paths, 'should equal paths')
        t.end()
      }))
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
