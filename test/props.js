module.exports = props

var resolve = require('path').resolve
  , getPaths = require('../lib/paths.js')

function props () {
  var source = 'source'
    , target = 'target'
    , config = require(resolve(source, 'views', 'config.js')) 
    , paths = getPaths(source, target, config)
    , views = {}
    , templates = {}
  
  var props = { 
    paths: paths
  , views: views
  , templates: templates 
  }

  return props
}
 
