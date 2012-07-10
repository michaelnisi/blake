module.exports = templates

var fs = require('fs')
,   resolve = require('path').resolve

function templates (path) {
  var templates = {}
  
  fs.readdirSync(path).forEach(function (name) {
    templates[name] = fs.readFileSync(resolve(path, name))
  })

  return templates
}
