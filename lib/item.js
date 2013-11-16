
// item - create and return source item

var join = require('path').join
  , path = require('path')
  , strftime = require('prettydate').strftime

var END_MARKER = '\n\n'
  , HTML = 'html'
  , XML = 'xml'
  , RSS = 'rss'
  , ATOM = 'atom'
  , DOT = '.'
  , SLASH = '/'
  , VIEWS = 'views'
  , CONFIG = 'config.js'

module.exports = function (props, filename, str) {
  var tokens = str.split(END_MARKER)
    , header = JSON.parse(tokens.shift() || null)
    , body = tokens.join(END_MARKER)
    , paths = props.paths
    , templates = props.templates
    , views = props.views

  if (!header) {
    throw(new Error('Header required in ' + filename))
  }

  if (!header.template) {
    throw(new Error('Template name required ' + filename))
  }

  if (!header.name) {
    var name = path.basename(filename).split(DOT)[0]
      , extension = name === ATOM || name === RSS ? XML : HTML

    header.name = name + DOT + extension
  }

  header.title = header.title || null
  header.date = header.date ? new Date(header.date) : new Date()
  header.path = header.path
    || path.dirname(filename).split(paths.posts)[1]
    || ''

  var item = new Item(
    header
  , body
  , paths
  , header.title
  , header.name
  , header.date
  , strftime(header.date, '%a, %d %b %Y %T %z')
  , header.date.toDateString()
  , join(paths.templates, header.template)
  , join(paths.target, header.path, header.name)
  , join(header.path, header.name)
  , views[header.template]
  , template = templates[header.template]
  )
  return item
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
