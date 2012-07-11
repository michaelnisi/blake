module.exports = blake

var resolve = require('path').resolve
  , fstream = require('fstream')
  , fs = require('fs')
  , oven = require('./oven')
  , copy = require('./copy')

function blake () {
  var args = Array.prototype.slice.call(arguments)
    , source = args.shift()
    , target = args.shift()
    , config = args.shift()
    , callback = args.pop()
    , files = args[0] || null
    , paths = require('./paths.js')(source, target, config)
    , templates = require('./templates.js')(paths.templates)
    , views = config.bakeFunctions
  
  var props = {
    templates: templates
  , views: views
  , paths: paths
  }

  if (files.length) {
    console.error('Implement specific file stuff')
    return callback()
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

