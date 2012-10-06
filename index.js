// blake - generate site

module.exports = blake

var resolve = require('path').resolve
  , fstream = require('fstream')
  , fs = require('fs')
  , es = require('event-stream')
  , generate = require('./lib/generate.js')
  , copy = require('./lib/copy.js')
  , popfun = require('popfun')

function blake () {
  var args = Array.prototype.slice.call(arguments)
    , source = args.shift()
    , target = args.shift()
    , callback = popfun(args)
    , config = require(resolve(source, 'config.js'))
    , paths = require('./lib/paths.js')(source, target, config)
    , templates = require('./lib/templates.js')(paths.templates)
    , views = config.views
    , specific = !!args.length && !!args[0].length
    , files = specific ? (Array.isArray(args[0]) ? args[0] : args) : null   
  var props = {
    templates: templates
  , views: views
  , paths: paths
  }

  var writer = generate(props)

  if (specific) {
    bake()
  } else {
    copy(paths.resources, target)
      .on('error', function (err) {
        console.error(err)
      })
      .on('end', function () {
        bake()
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
    var stream

    if (specific) {
      var entries = []
      files.forEach(function (file) {
        entries.push({ path: file })
      })
      stream = es.readArray(entries)
    } else {
      stream = fstream.Reader({ path: resolve(source, 'data') })
    }

    return stream
  }

  return writer
}
