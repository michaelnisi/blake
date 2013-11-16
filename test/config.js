
// config - configuration for testing

var path = require('path')
  , props = require('../lib/read').config

exports.source = path.resolve('../example/blake-site')
exports.target = '/tmp/blake-' + Math.floor(Math.random() * (1<<24))
exports.props = props(exports.source, exports.target)

