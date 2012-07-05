module.exports = blake

var resolve = require('path').resolve
,   templ = require('./templates.js')
,   generate = require('./generate.js')
,   copyr = require('./copyr')
,   fstream = require('fstream')

function blake (source, target) {
  var config = require(resolve(source, 'views', 'config.js'))
      templates = templ(resolve(source, 'templates'))

  copyr(source, target, function (err) {
    bake()
  })

  function bake () {
    process(fstream.Reader({ path: resolve(source, 'data') }))  
  }

  function process (entry) {
    entry.on('entry', process)
  }
}



