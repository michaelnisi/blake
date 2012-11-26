
// copy - copy source directory and its subtree to target directory

var fstream = require('fstream')
  , resolve = require('path').resolve
  , Stream = require('stream').Stream

module.exports = function (source, target, callback) {
  var reader = fstream.Reader({ path: source, filter: filter })
    , writer = fstream.Writer({ path: target, type: 'Directory' })
    , stream = new Stream()

  reader.on('error', function (err) {
    stream.emit('error', err)
  })

  reader.on('entry', function (entry) {
    if (entry.type === 'File') {
      stream.emit('data', entry.basename + '\n')
    }
  })

  writer.on('error', function (err) {
    stream.emit('error', err)
  })

  writer.on('end', function () {
    stream.emit('end')
    if (callback) callback()
  })

  reader.pipe(writer)

  return stream
}

function filter (entry) {
  return !entry.basename.match(/^\./)
}
