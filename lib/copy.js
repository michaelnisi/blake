// copy - copy source directory and its subtree to target directory

module.exports = copy

var fstream = require('fstream')
  , resolve = require('path').resolve

function copy (source, target, callback) {
  var reader = fstream.Reader({ path: source })
    , writer = fstream.Writer({ path: target, type: 'Directory' })
  
  reader.on('error', function (err) {
    writer.emit('error', err)
  })
  
  writer.on('end', function () {
    if (callback) callback()
  })

  return reader.pipe(writer)
}
