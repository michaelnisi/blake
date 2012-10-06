// read - read files and return blake items

module.exports = reader

var getItem = require('./getItem.js')
  , fs = require('fs')
  , fstream = require('fstream')
  , Stream = require('stream').Stream
  , me

function reader (props) {
  if (me) return me

  me = {}

  me.read = function (path, callback) {
    fs.stat(path, function (err, stats) {
      if (stats.isDirectory()) {
        readDirectory(path, callback)
      } else {
        readFile(path, callback)
      }
    })
  }

  me.clearCache = function () {
    me.cache = Object.create(null)
    return me
  }

  function readFile (filename, callback) {
    if (me.cache) {
      // TODO Cache?
    }
    
    fs.readFile(filename, function (err, data) {
      var item = getItem(props, filename, data.toString())
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
      if (entry.type !== 'File') {
        entry.on('entry', stream.add)
        return true
      }

      readFile(entry.path, function (err, item) {
        items.push(item)
        reader.resume()
      })
      return false
    }

    stream.end = function () {
      callback(null, items)
    }

    reader.pipe(stream)
  }

  return props.withCache ? me.clearCache() : me
}



