
// generate - generate and write artifacts

var Stream = require('stream').Stream
  , fs = require('fs')
  , write = require('./write.js')
  , reader = require('./read.js')

module.exports = function (props) {
  var stream = new Stream()
    , read = reader(props).read
    , currentFilename = null
    , ended = false
    , queue = []

  stream.writable = true
  stream.readable = true

  stream.resume = function () {
    stream.emit('resume')
  }

  stream.end = function () {
    ended = true
  }

  stream.write = function (filename) {
    queue.push(filename)
    work()
    return true
  }

  function work () {
    var filename = queue[0]

    if (filename === currentFilename) {
      return
    }

    if (!filename && ended) {
      stream.emit('end')
      return
    }

    currentFilename = filename

    read(filename, function (err, item) {
      bake(item, function (err) {
        if (err) {
          stream.emit('error', err)
        }

        stream.emit('data', item.path)

        queue.shift()
        work()
      })
    })
  }

  function bake (item, callback) {
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
