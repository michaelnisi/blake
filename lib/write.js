
// write - write file and create intermediate directories as required

var mkdirp = require('mkdirp')
  , dirname = require('path').dirname
  , writeFile = require('fs').writeFile

module.exports = function (path, data, callback) {
  mkdirp(dirname(path), function (err, made) {
    writeFile(path, data, callback)
  })
}
