module.exports = blake

var resolve = require('path').resolve
  , fstream = require('fstream')
  , fs = require('fs')
  , oven = require('./oven')
  , copyr = require('./copyr')
  , getPaths = require('./paths.js')

function blake (source, target, config, callback) {
  var paths = getPaths(source, target, config)
    , templates = require('./templates')(paths.templates)
    , views = config.bakeFunctions

  var props = {
    templates: templates
  , views: views
  , paths: paths
  }

  copyr(paths.resources, target, function (err) {
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

