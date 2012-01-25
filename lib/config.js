// This module covers configuration.

// Path conventions to use for input data.
exports.paths = {
  data: '/data',
  templates: '/templates/',
  resources: '/resources/',
  posts: '/data/posts'
};

// Map bake functions by template name. 
// Be invited to add your own.
//
// - TODO Add atom.js
// - TODO Add archive.js
exports.bakeFunctions = {
  'rss.jade': require('./rss.js').bake,
  'article.jade': require('./article.js').bake,
  'home.jade': require('./home.js').bake,
  'about.jade': require('./about.js').bake
};
