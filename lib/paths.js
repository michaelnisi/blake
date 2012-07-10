module.exports = paths

var join = require('path').join

function paths (source, target, config) {
  source = source || '/'
  target = target || '/'
  
  var paths = Object.create(null)
  paths.target = target
  paths.resources = config.paths.resources 
    ? join(source, config.paths.resources) 
    : null
  paths.data = config.paths.data 
    ? join(source, config.paths.data) 
    : null
  paths.templates = config.paths.templates 
    ? join(source, config.paths.templates) 
    : null
  paths.posts = config.paths.posts 
    ? join(source, config.paths.posts)
    : null
  
  return paths
}
