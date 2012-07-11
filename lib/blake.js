module.exports = blake

var resolve = require('path').resolve
  , fstream = require('fstream')
  , fs = require('fs')
  , oven = require('./oven')
  , copy = require('./copy')

function blake (source, target, config, callback) {
  var paths = require('./paths.js')(source, target, config)
    , templates = require('./templates.js')(paths.templates)
    , views = config.bakeFunctions

  var props = {
    templates: templates
  , views: views
  , paths: paths
  }

  copy(paths.resources, target, function (err) {
    bake()
  })
  
  function bake () {
    var reader = fstream.Reader({ path: resolve(source, 'data') })
      , writer = oven(props)
    
    reader.pipe(writer)

    writer.on('resume', function () {
      reader.resume()
    })

    writer.on('end', function () {
      if (callback) callback()
    })
  }
}

