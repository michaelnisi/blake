// generate - generate and write artifacts

module.exports = generate

var Stream = require('stream').Stream
  , fs = require('fs')
  , write = require('./write.js')
  , reader = require('./read.js')

function generate (props) {
  var stream = new Stream()
    , read = reader(props).read
    , ended = false
    , count = 0

  stream.writable = true
  stream.readable = true

  stream.resume = function () {
    stream.emit('resume')
  }

  stream.end = function () {
    ended = true

    if (count < 1) {
      stream.emit('end')
    }
  }

  stream.write = function (filename) {
    count++
   
    read(filename, function (err, item) {
      generate(item, function (err) {
        if (err) {
          stream.emit('error', err)
        }    
        
        stream.emit('data', item.path)
        count--
        
        if (ended) {
          stream.end()
          return true
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
      if (err) {
        stream.emit('error', err)
      }

      write(item.path, result, callback)
    })
  }

  return stream
}
