
// blake - generate site

var generate = require('./lib/generate.js')
  , getProps = require('./lib/getProps.js')

module.exports = function (source, target) {
  var props = getProps(source, target)

  return generate(props)
}
