var blake = require('blake')
  , source = '/Users/michael/workspace/troubled'
  , target = '/tmp/troubled-site'
  , resolve = require('path').resolve
  , Reader = require('fstream').Reader
  , props = { path:resolve(source, 'data') }
  , reader = new Reader(props)
  , cop = require('cop')

reader
  .pipe(cop('path'))
  .pipe(blake(source, target))
  .pipe(cop(function (filename) { return filename + '\n' }))
  .pipe(process.stdout)
