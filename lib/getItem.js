module.exports = getItem

var path = require('path')
  , END_MARKER = '\n\n'
  , HTML   = 'html'
  , XML    = 'xml'
  , RSS    = 'rss'
  , ATOM   = 'atom'
  , DOT    = '.'
  , SLASH  = '/'
  , VIEWS  = 'views'
  , CONFIG = 'config.js'

function getItem (props, filename, str) {
  var item = Object.create(null)
    , tokens = str.split(END_MARKER)
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

  header.date = header.date ? new Date(header.date) : new Date()
  header.path = header.path 
    || path.dirname(filename).split(paths.posts)[1]

  item.header = header
  item.body = body
  item.paths = paths
  
  item.title = header.title
  item.name = header.name
  item.date = header.date
  item.templatePath = path.join(paths.templates, header.template)
  item.path = path.join(paths.target, header.path, header.name)
  item.link = path.join(header.path, header.name)
  item.dateString = header.date.toDateString()
  item.bake = views[header.template]
  item.template = templates[header.template]
  
  return item
}
