// generate - generate blake site

var blake = require('blake')
  , source = 'blake-site'
  , target = '/tmp/blake-site'
  , join = require('path').join
  , Reader = require('fstream').Reader
  , props = { path:join(source, 'data') }
  , cop = require('cop')
  , copy = require('../lib/copy.js')

copy(join(source, 'resources'), target)
  .on('error', function (err) {
    console.error(err)
  })
  .on('end', function () {
    new Reader(props)
      .pipe(cop('path'))
      .pipe(blake(source, target))
      .pipe(cop(function (filename) { return filename + '\n' }))
      .pipe(process.stdout)
  })
