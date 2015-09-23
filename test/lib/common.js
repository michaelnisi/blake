exports.source = source
exports.freshTarget = freshTarget

var path = require('path')

function source (dir, file) {
  return path.resolve(dir, 'example', file || '')
}

function freshTarget () {
  return '/tmp/blake-' + Math.floor(Math.random() * (1 << 24))
}
