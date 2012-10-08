// blake - generate site

var generate = require('./lib/generate.js')
  , join = require('path').join

module.exports = function (source, target) {
  var config = require(join(source, 'config.js'))
    , paths = require('./lib/paths.js')(source, target, config)
    , templates = require('./lib/templates.js')(paths.templates)
    , views = config.views

  var props = {
    templates: templates
  , views: views
  , paths: paths
  }
  
  return generate(props)
}
