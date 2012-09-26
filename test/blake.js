var test = require('tap').test
  , blake  = require('../index.js')
  , resolve = require('path').resolve
  , rimraf = require('rimraf')
  , fs = require('fs')
  , source = 'source'
  , target = '/tmp/blake-test'

test('specified', function (t) {
  var file = resolve(source, 'data', 'about.md')
         
  blake(source, target, file)
    .on('end', function () {
      var artifact = resolve(target, 'about.html')
      t.ok(fs.statSync(artifact).isFile(), 'should be written')
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


