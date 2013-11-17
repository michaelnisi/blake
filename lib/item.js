
// item - create and return source item

module.exports.header = header
module.exports.item = item

var join = require('path').join
  , path = require('path')
  , strftime = require('prettydate').strftime

var END_MARKER = '\n\n'
  , HTML = 'html'
  , XML = 'xml'
  , RSS = 'rss'
  , ATOM = 'atom'
  , DOT = '.'

function item (props, file, str) {
  var tokens = str.split(END_MARKER)
    , paths = props.paths
    , h = header(tokens.shift(), file, paths)
  if (!h) return
  var body = tokens.join(END_MARKER)
    , templates = props.templates
    , views = props.views
  var item = new Item(
    h
  , body
  , paths
  , h.title
  , h.name
  , h.date
  , strftime(h.date, '%a, %d %b %Y %T %z')
  , h.date.toDateString()
  , join(paths.templates, h.template)
  , join(paths.target, h.path, h.name)
  , join(h.path, h.name)
  , views[h.template]
  , template = templates[h.template]
  )
  return item
}

function header (data, file, paths) {
  var h = null
  try {
    h = JSON.parse(data)
  } catch (er) {
    throw(new Error('Header required in ' + file))
    return h
  }
  if (!h.template) {
    throw(new Error('Template name required ' + file))
  }
  if (!h.name) {
    var name = path.basename(file).split(DOT)[0]
      , extension = name === ATOM || name === RSS ? XML : HTML
    h.name = [name, DOT, extension].join('')
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
, pubDate
, dateString
, templatePath
, path
, link
, bake
, template) {
  this.header = header
  this.body = body
  this.paths = paths
  this.title = title
  this.name = name
  this.date = date
  this.pubDate = pubDate
  this.dateString = dateString
  this.templatePath = templatePath
  this.path = path
  this.link = link
  this.bake = bake
  this.template = template
}
