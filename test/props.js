module.exports = props

var resolve = require('path').resolve

function props () {
  var source = 'source'
    , target = 'target'
    , config = require(resolve(source, 'config.js')) 
    , paths = require('../lib/paths')(source, target, config)
    , views = {}
    , templates = {}
  
  var props = { 
    paths: paths
  , views: views
  , templates: templates 
  }

  return props
}
 
