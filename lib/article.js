// This module is used to bake articles.

var jade = require('jade');
var markdown = require('markdown').markdown;

// Return a new locals object from the provided source object.
// The returned locals object is used by jade to populate fields
// in the template.
function getJadeLocals(src) {
  return {
    title: src.header.title,
    description: src.header.description,
    content: markdown.toHTML(src.body),
    link: src.link,
    date: src.date,
    time: src.date.getTime(),
    dateString: src.dateString
  };
}

// Bake article.
function bake(src, callback) {
  var options = { filename: src.templatePath, pretty: true };
  var jadeCompile = jade.compile(src.template, options);
  var result = jadeCompile(getJadeLocals(src));

  callback(null, src.path, src.name, result);
}

module.exports = {
  bake:bake,
  getJadeLocals:getJadeLocals
};
