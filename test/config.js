
// config - configuration for testing

var path = require('path')
  , getProps = require('../lib/getProps.js')

exports.source = path.resolve('../example/blake-site')
exports.target = '/tmp/blake-' + Math.floor(Math.random() * (1<<24))
exports.props = getProps(exports.source, exports.target)

