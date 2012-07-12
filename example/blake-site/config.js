exports.paths = {
  data: 'data'
, templates: 'templates'
, resources: 'resources'
}

exports.views = {
  'index.jade': require('./views/index.js').bake
}
