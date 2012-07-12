module.exports = props

var resolve = require('path').resolve
  , me

function props () {
  if (me) return me
  
  var source = 'source'
    , target = 'target'
    , config = require(resolve(source, 'config.js')) 
    , paths = require('../lib/paths')(source, target, config)
    , views = {}
    , templates = {}
  
  var me = { 
    paths: paths
  , views: views
  , templates: templates 
  }

  return me
}
 
