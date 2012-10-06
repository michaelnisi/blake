// blake - generate site

module.exports = blake

var generate = require('./lib/generate.js')
  , copy = require('./lib/copy.js')
  , resolve = require('path').resolve

function blake (source, target) {
  var config = require(resolve(source, 'config.js'))
    , paths = require('./lib/paths.js')(source, target, config)
    , templates = require('./lib/templates.js')(paths.templates)
    , views = config.views

  var props = {
    templates: templates
  , views: views
  , paths: paths
  }

  // probably generate should copy
  // copy(source, resolve(target, 'resources'))
  //   .on('error', function (err) {
  //     console.error(err)
  //   })
  //

  return generate(props)
}
