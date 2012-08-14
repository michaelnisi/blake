module.exports = write

var mkdirp = require('mkdirp')
  , dirname = require('path').dirname
  , writeFile = require('fs').writeFile

function write (path, data, callback) {
  mkdirp(dirname(path), function (err, made) {
    writeFile(path, data, callback) 
  })
}

