
// read - transform read files to blake items

var getItem = require('./getItem.js')
  , fs = require('fs')
  , fstream = require('fstream')
  , Writable = require('stream').Writable
  , hash = require('./hash.js')
  , cache = require('./cache.js')
  , StringDecoder = require('string_decoder').StringDecoder

var me = null

module.exports = function (props) {
  if (me) return me
  me = Object.create(null)
  me.read = function (path, cb) {
    if (!path) {
      cb(new Error('No Path'))
      return
    }
    fs.stat(path, function (er, stats) {
      if (stats.isDirectory()) {
        readDirectory(path, cb)
      } else {
        readFile(path, cb)
      }
    })
  }

  var decoder = new StringDecoder('utf8')
  function readFile (filename, cb) {
    var key = hash(filename)
    if ((cached = cache.get(key))) {
      cb(null, cached)
      return
    }
    fs.readFile(filename, function (er, data) {
      var item = getItem(props, filename, decoder.write(data))
      cache.set(key, item)
      return cb(er, item)
    })
  }

  function readDirectory(path, cb) {
    var reader = fstream.Reader({ path: path })
        stream = new Writable() // pseudo
    ,   items = []

    stream.add = function (entry) {
      if (entry.type === 'Directory') {
        entry.on('entry', stream.add)
        return true
      }
      readFile(entry.path, function (er, item) {
        items.push(item)
        reader.resume()
      })
      return false
    }
    stream.end = function () {
      cb(null, items)
    }
    reader.pipe(stream)
  }
  return me
}
