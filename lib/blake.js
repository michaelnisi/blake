// blake - generate site

var inherits = require('inherits')
,   fstream = require('fstream')
,   Stream = require('stream').Stream
,   fs = require('fs')
,   resolve = require('path').resolve

module.exports = function (props) {
  if (typeof props === "string") {
    props = { path: props }
  }

  var path = props.path
  ,   config = require(resolve(path, 'config.js'))
  ,   templates = resolve(path, config.paths.templates)
  ,   blake = new Blake(props)

  blake.config = config
  blake.templates = getTemplates(templates)

  return blake
}

function Blake (props) {
  Stream.call(this)

  var me = this

  me.readable = true
  me.writable = true

  me.buffer = []
  me.ready = false

  this.on('entry', appears)
}

inherits(Blake, Stream)


function appears (entry) {
  console.error("a %s appears!"
               , entry.type
               , entry.basename
               , typeof entry.basename)
              
  entry.on("entry", appears)
  
  if (entry.type === 'File') {
    var data = ''
      , me = this

    me.pause()
    entry.on('data', function (chunk) {
      data += chunk
    })
    entry.on('end', function () {
      me.resume()
      if (data.toString() === 'Hello') {
        entry._buffer.push('Ciao')
        this.emit('entry', entry)
      }
      console.error(data.toString())
    })
  }
}

Blake.prototype.end = function () {
  this.emit('end')
}

Blake.prototype.write = function (chunk) {
  console.error('write')
  return true
}



Blake.prototype.add = function (entry) {
  this.emit('entry', entry)
}

Blake.prototype.read = function () {
  console.error('read')
}

Blake.prototype.destroy = function () {
  consol.error('destroy')
}

Blake.prototype.pipe = function (dest, opts) {
  var me = this
  if (typeof dest.add === "function") {
    // piping to a multi-compatible, and we've got directory entries.
    me.on("entry", function (entry) {

      if (entry.basename === 'data') {
        return
      }
      if (entry.basename === 'templates' || entry.basename === 'data') {
        return
      }

      var ret = dest.add(entry)
      if (false === ret) {
        me.pause()
      }
    })
  }

  // console.error("R Pipe apply Stream Pipe")
  return Stream.prototype.pipe.apply(this, arguments)
}

Blake.prototype.pause = function (who) {
  this._paused = true
  who = who || this
  this.emit("pause", who)
  if (this._stream) this._stream.pause(who)
}

Blake.prototype.resume = function (who) {
  this._paused = false
  who = who || this
  this.emit("resume", who)
  if (this._stream) this._stream.resume(who)
  // this._read()
}
function getTemplates(p) {
  var templates = {}
  
  fs.readdirSync(p).forEach(function (name) {
    templates[name] = fs.readfileSync(path.resolve(p, name))
  })

  return templates
}
