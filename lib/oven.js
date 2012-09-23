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
    , busy = false

  stream.writable = true
  stream.readable = true

  stream.add = function (entry) {
    return bake(entry)
  }

  stream.resume = function () {
    stream.emit('resume')
  }

  stream.end = function () {
    ended = true

    if (!busy) {
      stream.emit('end')
    }
  }

  stream.write = stream.add
  
  function bake (entry) {
    if (entry.type === 'Directory') {
      entry.on('entry', bake)
      return true
    }

    busy = true
    
    read(entry.path, function (err, item) {
      generate(item, function (err) {
        if (err) {
          stream.emit('error', err)
        }    

        if (ended) {
          stream.emit('end')
          ended = false
          return
        }

        stream.emit('data', item)
        stream.resume()

        busy = false
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
      if (err) {
        stream.emit('error', err)
      }

      write(item.path, result, callback)
    })
  }

  return stream
}
