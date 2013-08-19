
// generate - generate blake site
// $ cd example ; node generate.js

var blake = require('blake')
  , join = require('path').join
  , source = join(process.cwd(), './blake-site')
  , target = '/tmp/blake-site'
  , Reader = require('fstream').Reader
  , props = { path:join(source, 'data') }
  , cop = require('cop')
  , copy = require('../lib/copy.js')

copy(join(source, 'resources'), target)
  .on('error', console.error)
  .on('end', function () {
    new Reader(props)
      .pipe(cop('path'))
      .pipe(blake(source, target))
      .pipe(cop(function (filename) { return filename + '\n' }))
      .pipe(process.stdout)
  })
  .pipe(process.stdout)
