var blake = require('../index.js')
  , es = require('event-stream')
  , path = require('path')
  , cop = require('cop')
  , fstream = require('fstream')
  , test = require('tap').test
  , config = require('./config.js')
  , source = config.source
  , target = config.target

var wanted = [
  path.join(target, 'index.html')
]

test('read array of filenames', function (t) {
  var filenames = [
    path.join(source, 'data', 'index.md')
  ]

  es.readArray(filenames)
    .pipe(blake(source, target))
    .pipe(es.writeArray(function (err, array) {
      t.equal(array.length, wanted.length)
      t.deepEqual(array, wanted)
      t.end()
    }))
})

test('files written', function (t) {
  fstream.Reader({ path:target })
    .pipe(cop('path'))
    .pipe(es.writeArray(function (err, lines) {
      t.deepEqual(lines, wanted, 'should equal paths')
      t.end()
    }))
  t.end()
})
