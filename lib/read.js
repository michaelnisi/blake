
// read - transform read files to blake items

var getItem = require('./getItem.js')
  , fs = require('fs')
  , fstream = require('fstream')
  , Writable = require('stream').Writable
  , StringDecoder = require('string_decoder').StringDecoder
  , createHash = require('crypto').createHash
  , LRU = require("lru-cache")

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

  var cache = LRU({ max: 50, maxAge: 1000 * 60 * 3 })
  var decoder = new StringDecoder('utf8')
  function readFile (filename, cb) {
    var key = createHash('md5').update(filename).digest('hex')
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
