
// blake - generate site

var Transform = require('stream').Transform
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , dirname = require('path').dirname
  , writeFile = require('fs').writeFile
  , StringDecoder = require('string_decoder').StringDecoder
  , read = require('./lib/read.js').readItems
  , getProps = require('./lib/read.js').config

module.exports = function (s, target) {
  var props = s && target ? getProps(s, target) : s
    , decoder = new StringDecoder('utf8')
    , stream = new Transform({ objectMode:true })

  stream._transform = function (chunk, encoding, cb) {
    var filename = decoder.write(chunk)
    read(props)(filename, function (er, item) {
      bake(item, function (er) {
        stream.push(item.path)
        cb(er)
      })
    })
  }

  function bake (item, cb) {
    if (!item.bake) {
      cb(new Error('Undefined bake function for ' + item.name))
      return
    }
    item.read = read(props)
    item.bake(item, function (er, result) {
      if (er) {
        stream.emit('error', er)
        return
      }
      write(item.path, result, cb)
    })
  }

  return stream
}

function write (path, data, callback) {
  mkdirp(dirname(path), function (err, made) {
    writeFile(path, data, callback)
  })
}
