module.exports = blake

var resolve = require('path').resolve
,   fstream = require('fstream')
,   fs = require('fs')
,   oven = require('./oven')
,   copyr = require('./copyr')

function blake (source, target, callback) {
  var views = require(resolve(source, 'views', 'config.js'))
      templates = require('./templates')(resolve(source, 'templates'))

  copyr(source, target, function (err) {
    bake()
  })

  function bake () {
    var reader = fstream.Reader({ path: resolve(source, 'data') })
    ,   writer = oven(source, target, views, templates)

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



