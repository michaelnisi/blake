var blake = require('../index.js')
  , es = require('event-stream')
  , path = require('path')
  , cop = require('cop')
  , fstream = require('fstream')
  , test = require('tap').test
  , source = path.resolve('../example/blake-site')
  , target = '/tmp/blake-' + Math.floor(Math.random() * (1<<24))

var expected = [
  path.join(target, 'index.html')
]

test('read array of filenames', function (t) {
  var filenames = [
    path.join(source, 'data', 'index.md')
  ]

  var reader = es.readArray(filenames)

  reader
    .pipe(blake(source, target))
    .pipe(es.writeArray(function (err, array) {
      t.equal(array.length, expected.length)
      var contains = false
      expected.forEach(function (a) {
        contains = array.some(function (b) {
          return a === b
        })
        t.ok(contains, 'should contain all expected')
      })
      t.end()
    }))
})

test('files written', function (t) {
  var reader = fstream.Reader({ path:target })

  reader
    .pipe(cop('path'))
    .pipe(es.writeArray(function (err, lines) {
      t.deepEqual(lines, expected, 'should equal paths')
      t.end()
    }))
  t.end()
})
