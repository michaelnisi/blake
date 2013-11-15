
// blake - generate site

var Transform = require('stream').Transform
  , fs = require('fs')
  , write = require('./lib/write.js')
  , reader = require('./lib/read.js')
  , getProps = require('./lib/getProps.js')

module.exports = function (s, target) {
  var props = s && target ? getProps(s, target) : s

  var stream = new Transform({ objectMode:true })
    , read = reader(props).read

  stream._transform = function (chunk, encoding, cb) {
    var filename = chunk.toString()
    read(filename, function (err, item) {
      process(item, function (err) {
        stream.push(item.path)
        cb(err)
      })
    })
  }

  function process (item, cb) {
    if (!item.bake) {
      cb(new Error('Undefined bake function for ' + item.name))
      return
    }
    item.read = read
    item.bake(item, function (err, result) {
      if (err) {
        stream.emit('error', err)
        return
      }
      write(item.path, result, cb)
    })
  }

  return stream
}
