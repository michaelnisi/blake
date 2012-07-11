module.exports = oven

var Stream = require('stream').Stream
  , fs = require('fs')
  , resolve = require('path').resolve
  , write = require('./write.js')
  , reader = require('./read.js')

function oven (props) {
  var stream = new Stream()
    , read = reader(props).read
    , ended = false

  stream.writable = true
  stream.readable = false

  stream.add = function (entry) {
    return process(entry)
  }

  stream.resume = function () {
    stream.emit('resume')
  }

  stream.end = function () {
    ended = true
  }

  stream.write = stream.add
  
  function process (entry) {
    if (entry.type === 'Directory') {
      entry.on('entry', process)
      return true
    }

    read(entry.path, function (err, item) {
      generate(item, function (err) {
        if (err) console.error(err)
        if (ended) {
          stream.emit('end')
          return ended = false
        }
        stream.resume()
      })
    })

    return false
  }

  function generate (item, callback) {
    if (!item.bake) {
      return callback(new Error(
        'Undefined bake function for ' + item.name
      ))
    }

    item.read = read // so it can read

    item.bake(item, function (err, result) { 
      if (err) console.error(err)
      write(item.path, result, callback)
    })
  }

  return stream
}
