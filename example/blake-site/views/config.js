exports.paths = {
  data: 'data',
  templates: 'templates',
  resources: 'resources'
};

exports.bakeFunctions = {
  'index.jade': require('./index.js').bake
};
