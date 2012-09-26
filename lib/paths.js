// paths - default paths

module.exports = paths

var join = require('path').join
  , me

function paths (source, target, config) {
  if (me) return me
  
  source = source || '/'
  target = target || '/'
  
  var me = Object.create(null)
  
  me.target = target
  me.resources = config.paths.resources 
    ? join(source, config.paths.resources) 
    : null
  me.data = config.paths.data 
    ? join(source, config.paths.data) 
    : null
  me.templates = config.paths.templates 
    ? join(source, config.paths.templates) 
    : null
  me.posts = config.paths.posts 
    ? join(source, config.paths.posts)
    : null
  
  return me
}
