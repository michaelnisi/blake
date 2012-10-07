// getReader - return stream of filenames

module.exports = getReader

var Reader = require('fstream').Reader
  , resolve = require('path').resolve
  , readArray = require('event-stream').readArray

function getReader (source, filenames) {
  var reader

  if (filenames.length) {
    var items = []

    filenames.forEach(function (filename) {
      items.push({ path:filename })
    })
    
    reader = readArray(items)
  } else {
    reader = new Reader({ path:resolve(source, 'data') })
  }

  return reader
}
