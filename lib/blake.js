module.exports = blake

var resolve = require('path').resolve
  , fstream = require('fstream')
  , fs = require('fs')
  , es = require('event-stream')
  , oven = require('./oven.js')
  , copy = require('./copy.js')
  , popfun = require('./popfun.js')

function blake () {
  var args = Array.prototype.slice.call(arguments)
    , source = args.shift()
    , target = args.shift()
    , callback = popfun(args)
    , config = require(resolve(source, 'config.js'))
    , paths = require('./paths.js')(source, target, config)
    , templates = require('./templates.js')(paths.templates)
    , views = config.views
    , specific = !!args.length && !!args[0].length
    , files = specific ? (Array.isArray(args[0]) ? args[0] : args) : null   
  var props = {
    templates: templates
  , views: views
  , paths: paths
  }

  var writer = oven(props)

  if (specific) {
    bake()
  } else {
    copy(paths.resources, target, function (err) {
      bake()
    }).on('error', function (err) {
      console.error(err) // unlikely
    })
  }

  function bake () {
    var reader = getReader()  
    
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

  return writer
}
