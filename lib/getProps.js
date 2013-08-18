
// getProps - get properties

var join = require('path').join

module.exports = function (source, target) {
  var config = require(join(source, 'config.js'))
    , paths = require('./paths.js')(source, target, config)
    , templates = require('./templates.js')(paths.templates)
    , views = config.views

  var props = {
    templates:templates
  , views:views
  , paths:paths
  }

  return props
}
