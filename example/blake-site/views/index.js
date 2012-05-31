// This module generates the home page.

var jade = require('jade');
var markdown = require('markdown').markdown; 

exports.bake = function(src, callback) {
  var options = { filename:src.templatePath, pretty:true };
  var compile = jade.compile(src.template, options);
  
  var locals = {
    headline: 'blake',
    subline: 'agnostic site bakery',
    code: 'https://github.com/michaelnisi/blake',
    docs: 'http://michaelnisi.github.com/blake/blake.html',
    description: 'blake generates sites',
    author: 'Michael Nisi',
    content: markdown.toHTML(src.body)
  };
  
  callback(null, src, compile(locals));
}
