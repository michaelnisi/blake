// This module bakes the about page.

var jade = require('jade');
var markdown = require('markdown').markdown;

// Create jade options file and set the path to the template, 
// which is required for template includes and template inheritance.
// Setup Jade compile function with the template and the options.
// And finally compile jade template with according locals.
var bake = function (src, callback) {
  var options = { filename: src.templatePath, pretty: true };
  var jadeCompile = jade.compile(src.template, options);
  var result = jadeCompile({
    mainNavigationItems: src.header.menu,
    title: src.header.title,
    description: src.header.description,
    content: markdown.toHTML(src.body),
    dateString: src.dateString
  });

  callback(null, src.path, src.name, result);
};

module.exports = {
  bake:bake
};
