module.exports = copyr

var fstream = require('fstream')
  , resolve = require('path').resolve

function copyr (source, target, callback) {
  var reader = fstream.Reader({ path: source })
    , writer = fstream.Writer({ path: target, type: 'Directory' })
    , ended = false
  
  reader.pipe(writer)
  
  reader.on('error', function (err) {
    console.error(err)
  })

  writer.on('error', function (err) {
    console.error(err)
  })

  writer.on('end', function () {
    if (!ended && callback) {
      ended = true
      callback()
    }
  })
}
