
// copy - copy source directory and its subtree to target directory

var fstream = require('fstream')
  , resolve = require('path').resolve
  , Readable = require('stream').Readable
  , path = require('path')

module.exports = function (source, target, callback) {
  var reader = fstream.Reader({ path: source, filter: filter })
    , writer = fstream.Writer({ path: target, type: 'Directory' })
    , stream = new Readable()

  reader.on('error', function (err) {
    stream.emit('error', err)
  })

  reader.on('entry', function (entry) {
    push(entry)
  })

  writer.on('error', function (err) {
    stream.emit('error', err)
  })

  writer.on('end', function () {
    stream.emit('end')
    if (callback) callback()
  })

  function push (entry) {
    if (entry.type === 'File') {
      var p = path.join(target, entry.path.split(source)[1] || '')
      stream.push(p + '\n')
    } else {
      entry.on('entry', push)
    }
  }

  stream._read = function (size, callback) {
    // well ...
  }

  reader.pipe(writer)

  return stream
}

function filter (entry) {
  return !entry.basename.match(/^\./)
}
