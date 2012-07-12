module.exports = blake

var resolve = require('path').resolve
  , fstream = require('fstream')
  , fs = require('fs')
  , es = require('event-stream')
  , oven = require('./oven')
  , copy = require('./copy')

function blake () {
  var args = Array.prototype.slice.call(arguments)
    , source = args.shift()
    , target = args.shift()
    , config = args.shift()
    , callback = args.pop()
    , files = args[0]
    , paths = require('./paths.js')(source, target, config)
    , templates = require('./templates.js')(paths.templates)
    , views = config.bakeFunctions
    , specific = !!files && !!files.length

  var props = {
    templates: templates
  , views: views
  , paths: paths
  }
  
  if (specific) {
    bake()
  } else {
    copy(paths.resources, target, function (err) {
      bake()
    })
  }

  function bake () {
    var reader = getReader()  
      , writer = oven(props)
    
    reader.pipe(writer)

    writer.on('resume', function () {
      reader.resume()
    })

    writer.on('end', function () {
      if (callback) callback()
    })
  }

  function getReader() { 
    if (specific) {
      var entries = []
      files.forEach(function (file) {
        entries.push({ path: file })
      })
      return es.readArray(entries)
    }
    
    return fstream.Reader({ path: resolve(source, 'data') })
  }
}
