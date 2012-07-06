module.exports = blake

var resolve = require('path').resolve
,   fstream = require('fstream')
,   fs = require('fs')
,   oven = require('./oven')
,   copyr = require('./copyr')
,   getPaths = require('./paths.js')

function blake (source, target, callback) {
  var config = require(resolve(source, 'views', 'config.js'))
  ,   templates = require('./templates')(resolve(source, 'templates'))
  ,   views = config.bakeFunctions
  ,   paths = getPaths(source, target, config)

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
    ,   writer = oven(props)
    
    reader.pipe(writer)

    writer.on('resume', function () {
      reader.resume()
    })

    writer.on('end', function () {
      console.error('Rad!')
      if (callback) callback()
    })
  }
}

