// blake - generate site

module.exports = Blake

module.exports.copy = copy
module.exports.files = files

var LRU = require('lru-cache')
var createHash = require('crypto').createHash
var cop = require('cop')
var fs = require('fs')
var fstream = require('fstream')
var mkdirp = require('mkdirp')
var path = require('path')
var readArray = require('event-stream').readArray
var stream = require('stream')
var string_decoder = require('string_decoder')
var util = require('util')

function Blake (source, target) {
  if (!(this instanceof Blake)) return new Blake(source, target)
  stream.Transform.call(this, { objectMode: true })

  this._conf = conf(source, target)
  this._reader = new ItemReader(this._conf)
  this._decoder = new string_decoder.StringDecoder()

  var me = this
  Object.defineProperty(this, 'resources', {
    get: function () { return me._conf.paths.resources }
  })
  Object.defineProperty(this, 'data', {
    get: function () { return me._conf.paths.data }
  })
}
util.inherits(Blake, stream.Transform)

function write (p, data, cb) {
  mkdirp(path.dirname(p), function (er, made) {
    er ? cb(er) : fs.writeFile(p, data, cb)
  })
}

Blake.prototype._transform = function (chunk, enc, cb) {
  var me = this
  var filename = this._decoder.write(chunk)
  function view (item, cb) {
    if (!item.view) {
      cb(new Error('blake: ' + item.name + ' misses view function'))
      return
    }
    item.read = function (p, cb) {
      me.items(p, cb)
    }
    item.view(item, function (error, result) {
      if (error) {
        var msg = ['blake', 'view error', item.path, error.message].join(': ')
        var er = new Error(msg)
        er.item = item
        return me.emit('error', er)
      }
      write(item.path, result, function (error) {
        if (error) {
          cb(new Error('blake: write error: ' + error.message))
        } else {
          cb()
        }
      })
    })
  }
  me._reader.read(filename, function (er, item) {
    if (er) return cb(er)
    view(item, function (er) {
      me.push(item.path)
      cb(er)
    })
  })
}

Blake.prototype.items = function (p, cb) {
  this._reader.read(p, cb)
}

function item (conf, file, str) {
  var marker = '\n\n'
  var tokens = str.split(marker)
  var paths = conf.paths
  var h = header(tokens.shift(), file, paths)
  var body = tokens.join(marker)
  var views = conf.views
  return new Item(
    h,
    body,
    paths,
    h.title,
    h.name,
    h.date,
    path.join(paths.templates, h.template),
    path.join(paths.target, h.path, h.name),
    path.join(h.path, h.name),
    views[h.template] // view
  )
}

function header (data, file, paths) {
  var h = null
  try {
    h = JSON.parse(data)
  } catch (error) {
    throw new Error('blake: header error: ' + file + ': ' + error.message)
  }
  if (!h.template) {
    throw new Error('blake: template required: ' + file)
  }
  if (!h.name) {
    var name = path.basename(file).split('.')[0]
    var extension = name === 'atom' || name === 'rss' ? 'xml' : 'html'
    h.name = [name, '.', extension].join('')
  }
  h.title = h.title || null
  h.date = h.date ? new Date(h.date) : new Date()
  h.path = h.path || path.dirname(file).split(paths.posts)[1] || ''
  return h
}

function Item (
  header
, body
, paths
, title
, name
, date
, templatePath
, path
, link
, view) {
  this.header = header
  this.body = body
  this.paths = paths
  this.title = title
  this.name = name
  this.date = date
  this.templatePath = templatePath
  this.path = path
  this.link = link
  this.view = view
}

function files (p) {
  if (p instanceof Array && p.length) {
    return readArray(p)
  } else {
    var filter = cop(function (entry) { return entry.path })
    var reader = new fstream.Reader({ path: p })
    return reader.pipe(filter)
  }
}

function Paths (resources, data, templates, posts, target) {
  this.resources = resources
  this.data = data
  this.templates = templates
  this.posts = posts
  this.target = target
}

function paths (source, target, conf) {
  var p = conf.paths
  var resources = p.resources ? path.join(source, p.resources) : null
  var data = p.data ? path.join(source, p.data) : null
  var templates = p.templates ? path.join(source, p.templates) : null
  var posts = p.posts ? path.join(source, p.posts) : null
  return new Paths(resources, data, templates, posts, target)
}

function conf (source, target) {
  if (typeof source === 'string') {
    if (typeof target !== 'string') {
      target = source
      source = process.cwd()
    }
  }
  var uc = require(source)
  var res = Object.create(null)
  res.paths = paths(source, target, uc)
  res.views = uc.views
  return res
}

function ItemReader (conf) {
  if (!(this instanceof ItemReader)) return new ItemReader(conf)
  this.conf = conf
  this.decoder = new string_decoder.StringDecoder()
  this.cache = new LRU({ max: 500, maxAge: 1000 * 60 * 3 })
}

ItemReader.prototype.read = function (p, cb) {
  if (!p) {
    cb(new Error('blake: read error: no path'))
    return
  }
  var me = this
  fs.stat(p, function (er, stats) {
    if (stats.isDirectory()) {
      me.readDirectory(p, cb)
    } else {
      me.readFile(p, cb)
    }
  })
}

function hash (str) {
  return createHash('md5').update(str).digest('hex')
}

ItemReader.prototype.readFile = function (filename, cb) {
  var k = hash(filename)
  if (this.cache.has(k)) {
    return cb(null, this.cache.get(k))
  }
  var me = this
  var cache = this.cache
  fs.readFile(filename, function (er, data) {
    var it = item(me.conf, filename, me.decoder.write(data))
    Object.defineProperty(it, 'template', {
      get: function () {
        var k = hash(it.templatePath)
        if (cache.has(k)) return cache.get(k)
        var buf = fs.readFileSync(it.templatePath)
        cache.set(k, buf)
        return buf
      }
    })
    cache.set(k, it)
    return cb(er, it)
  })
}

ItemReader.prototype.readDirectory = function (p, cb) {
  var reader = fstream.Reader({ path: p })
  var s = new stream.Writable()
  var items = []
  var me = this
  s.add = function (entry) {
    if (entry.type === 'Directory') {
      entry.on('entry', s.add)
      return true
    }
    me.readFile(entry.path, function (er, item) {
      items.push(item)
      entry.depth === 1 ? s.end() : reader.resume()
    })
    return false
  }
  s.end = function () {
    cb(null, items)
  }
  reader.pipe(s)
}

function filter (entry) {
  return !entry.basename.match(/^\./)
}

function copy (source, target, cb) {
  var reader = fstream.Reader({ path: source, filter: filter })
  var writer = fstream.Writer({ path: target, type: 'Directory' })
  var s = new stream.PassThrough()
  function push (entry) {
    if (entry.type === 'File') {
      var p = path.join(target, entry.path.split(source)[1] || '')
      s.push(p + '\n')
    } else {
      entry.on('entry', push)
    }
  }
  reader.on('error', function (err) {
    s.emit('error', err)
  })
  reader.on('entry', function (entry) {
    push(entry)
  })
  writer.on('error', function (err) {
    s.emit('error', err)
  })
  writer.on('end', function () {
    s.push(null)
    if (cb) cb()
  })
  reader.pipe(writer)
  return s
}

if (parseInt(process.env.NODE_TEST, 10) === 1) {
  module.exports.ItemReader = ItemReader
  module.exports.conf = conf
  module.exports.header = header
  module.exports.item = item
  module.exports.paths = paths
  module.exports.write = write
}
