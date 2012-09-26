var test = require('tap').test
  , copy = require('../lib/copy.js')
  , fs = require('fs')
  , rimraf = require('rimraf')
  , source = 'source/resources'
  , target = '/tmp/blake-test'
  , fstream = require('fstream')
  , es = require('event-stream')
  , fish = require('fish')

test('directory', function (t) {
  copy(source, target, function (err) {
    t.ok(fs.statSync(target).isDirectory(), 'should be copied')
    
    var reader = fstream.Reader({ path:target })
      , paths = ['/tmp/blake-test/css']

    reader
      .pipe(fish('path'))
      .pipe(es.writeArray(function (err, lines) {
        t.deepEqual(lines, paths, 'should be paths')
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
