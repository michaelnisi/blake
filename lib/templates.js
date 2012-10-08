// templates - cache templates

var fs = require('fs')
  , resolve = require('path').resolve
  , me

module.exports = function (path) {
  if (me) return me
  
  me = {}
  
  fs.readdirSync(path).forEach(function (name) {
    me[name] = fs.readFileSync(resolve(path, name))
  })

  return me
}
