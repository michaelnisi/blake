
var resolve = require('path').resolve
  , source = exports.source = 'source'
  , target = exports.target = '/tmp/blake-test'
  , config = exports.config = require(resolve(source, 'config.js')) 

exports.paths = require('../lib/paths')(source, target, config)
exports.views = {}
exports.templates = {}

if (module === require.main) {
  console.log(exports)
  process.exit(0)
}
