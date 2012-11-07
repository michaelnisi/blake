
// generate - generate and write artifacts

var Stream = require('stream').Stream
  , fs = require('fs')
  , write = require('./write.js')
  , reader = require('./read.js')

module.exports = function (props) {
  var stream = new Stream()
    , read = reader(props).read
    , count = 0
    , ended = false

  stream.writable = true
  stream.readable = true

  stream.pause = function () {
    stream.emit('pause')
  }

  stream.resume = function () {
    stream.emit('resume')
  }

  stream.end = function () {
    ended = true
  }

  stream.write = function (filename) {
    handle(filename)
    return false
  }

  function handle (filename) {
    count++
    read(filename, function (err, item) {
      if (err) {
        count--
        stream.emit('error', err)
        stream.emit('drain')  
        return
      }

      bake(item, function (err) {
        count--
        err ? stream.emit('error', err) : stream.emit('data', item.path)
        stream.emit(ended && !count ? 'end' : 'drain')
      })
    })
  }

  function bake (item, callback) {
    if (!item.bake) {
      callback(new Error('Undefined bake function for ' + item.name))
      return
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
