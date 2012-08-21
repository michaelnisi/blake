var jade = require('jade')
  , markdown = require('markdown').markdown 

exports.bake = function(item, callback) {
  var options = { filename:item.templatePath, pretty:true }
    , compile = jade.compile(item.template, options)

  var locals = {
      headline: 'blake'
    , subline: 'agnostic site bakery'
    , code: 'https://github.com/michaelnisi/blake'
    , npm: 'https://npmjs.org/package/blake'
    , description: 'blake generates sites'
    , author: 'Michael Nisi'
    , content: markdown.toHTML(item.body)
  }

  callback(null, compile(locals))
}
