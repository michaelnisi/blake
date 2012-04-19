// This module generates the home page.

var jade = require('jade');
var markdown = require('markdown').markdown; 

exports.bake = function(src, callback) {
  var options = { filename:src.templatePath, pretty:true };
  var compile = jade.compile(src.template, options);
  
  var locals = {
    headline: 'Blake',
    subline: 'Agnostic site bakery',
    code: 'https://github.com/michaelnisi/blake',
    docs: 'http://michaelnisi.github.com/blake/blake.html',
    description: 'Blake is a Node.js module infrastructure to generate static websites.',
    author: 'Michael Nisi',
    content: markdown.toHTML(src.body)
  };
  
  callback(null, src, compile(locals));
}
