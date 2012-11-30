
// read - read files and return blake items

var getItem = require('./getItem.js')
  , fs = require('fs')
  , fstream = require('fstream')
  , Stream = require('stream').Stream
  , hash = require('./hash.js')
  , cache = require('./cache.js')
  , me

module.exports = function (props) {
  if (me) return me

  me = {}

  me.read = function (path, callback) {
    if (!path) {
      callback(new Error('No Path'))
      return
    }

    fs.stat(path, function (err, stats) {
      if (stats.isDirectory()) {
        readDirectory(path, callback)
      } else {
        readFile(path, callback)
      }
    })
  }

  function readFile (filename, callback) {
    var key = hash(filename)
      , cached = cache.get(key)

    if (cached) {
      callback(null, cached)
      return
    }

    fs.readFile(filename, function (err, data) {
      var item = getItem(props, filename, data.toString())
      cache.set(key, item)
      return callback(err, item)
    })
  }

  function readDirectory(path, callback) {
    var reader = fstream.Reader({ path: path })
        stream = new Stream()
    ,   items = []

    stream.writeable = true
    stream.readable = false

    stream.add = function (entry) {
      if (entry.type === 'Directory') {
        entry.on('entry', stream.add)
        return true
      }

      readFile(entry.path, function (err, item) {
        var seen = items.some(function (it) {
          return it.path === item.path
        })

        // not sure why we get repeats here
        if (!seen) items.push(item)
        reader.resume()
      })
      return false
    }

    stream.end = function () {
      callback(null, items)
    }

    reader.pipe(stream)
  }

  return me
}



