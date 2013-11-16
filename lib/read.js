
// read - read all the things

module.exports.readItems = readItems
module.exports.fstream = fstream
module.exports.conf = conf

var getItem = require('./item')
  , util = require('util')
  , fs = require('fs')
  , join = require('path').join
  , Writable = require('stream').Writable
  , createHash = require('crypto').createHash
  , Reader = require('fstream').Reader
  , resolve = require('path').resolve
  , readArray = require('event-stream').readArray
  , LRU = require("lru-cache")
  , cache = LRU({ max: 50, maxAge: 1000 * 60 * 3 })
  , StringDecoder = require('string_decoder').StringDecoder
  , decoder = new StringDecoder('utf8')

function fstream (source, filenames) {
  var reader
  if (filenames.length) {
    var items = []
    filenames.forEach(function (filename) {
      items.push({ path:filename })
    })
    reader = readArray(items)
  } else {
    reader = new Reader({ path:resolve(source, 'data') })
  }
  return reader
}

function Paths (resources, data, templates, posts, target) {
  this.resources = resources
  this.data = data
  this.templates = templates
  this.posts = posts
  this.target = target
}

var pathz = null
function paths (source, target, config) {
  if (pathz) return pathz
  source = source || '/'
  target = target || '/'
  var p = config.paths
    , resources = p.resources ? join(source, p.resources) : null
    , data = p.data ? join(source, p.data) : null
    , templates = p.templates ? join(source, p.templates) : null
    , posts = p.posts ? join(source, p.posts) : null

  pathz = new Paths(resources, data, templates, posts, target)
  return pathz
}

function conf (source, target) {
  var uc = require(join(source, 'config.js'))
  var res = Object.create(null)
  res.paths = paths(source, target, uc)
  res.templates = templates(res.paths.templates)
  res.views = uc.views
  return res
}

var templatez = null
function templates (path) {
  if (templatez) return templatez
  templatez = Object.create(null)
  fs.readdirSync(path).forEach(function (name) {
    templatez[name] = fs.readFileSync(resolve(path, name))
  })
  return templatez
}

function readItems (props) {
  var reader = new ItemReader(props)
  return function (path, cb) {
    reader.read(path, cb)
  }
}

function ItemReader (props) {
  if (!(this instanceof ItemReader)) return new ItemReader(props)
  this.props = props
}

ItemReader.prototype.read = function (path, cb) {
  if (!path) {
    cb(new Error('No Path'))
    return
  }
  var me = this
  fs.stat(path, function (er, stats) {
    if (stats.isDirectory()) {
      me.readDirectory(path, cb)
    } else {
      me.readFile(path, cb)
    }
  })
}

ItemReader.prototype.readFile = function (filename, cb) {
  var key = createHash('md5').update(filename).digest('hex')
  if ((cached = cache.get(key))) {
    cb(null, cached)
    return
  }
  me = this
  fs.readFile(filename, function (er, data) {
    var item = getItem(me.props, filename, decode(data))
    cache.set(key, item)
    return cb(er, item)
  })
}

ItemReader.prototype.readDirectory = function (path, cb) {
  var reader = Reader({ path: path })
    , stream = new Writable() // pseudo
    , items = []
    , me = this

  stream.add = function (entry) {
    if (entry.type === 'Directory') {
      entry.on('entry', stream.add)
      return true
    }
    me.readFile(entry.path, function (er, item) {
      items.push(item)
      entry.depth === 1 ? stream.end() : reader.resume()
    })
    return false
  }
  stream.end = function () {
    cb(null, items)
  }
  reader.pipe(stream)
}

function decode (data) {
  return decoder.write(data)
}
