
// config - configuration for testing

var path = require('path')
  , conf = require('../lib/read').conf

exports.source = path.resolve('../example/blake-site')
exports.target = '/tmp/blake-' + Math.floor(Math.random() * (1<<24))
exports.props = conf(exports.source, exports.target)

