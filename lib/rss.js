// The rss.js module generates the rss feed.

var step = require('step');
var jade = require('jade');
var io = require('./io.js');
var input = require('./input.js');
var markdown = require('markdown').markdown;

// Get source file for input file and return a new RSS feed item populated 
// with the values form the source object. 
function getItem (file, filename, paths) {
  var src = input.getSource(file, filename, paths);

  if (!src) {
    return null;
  }

  var summary = '<h4>' + src.header.description + '</h4>';

  return {
    title: src.header.title,
    description: src.header.description,
    content: summary + markdown.toHTML(src.body),
    link: src.link,
    date: src.dateString
  };
}

// After reading the article file, get the RSS feed item for that article
// and add it to the items array.
function addItem (name, paths, items, callback) {
  io.readFile(name, function (err, data) {
    if (err) {
      throw err;
    }
    items.push(getItem(data, name, paths));
    callback(err, items);
  });
}

// Bake the RSS feed XML file.
function bake (src, callback) {
  var items, result, options, rss;

  options = { filename: src.templatePath, pretty: true };
  items = [];
  rss = jade.compile(src.template, options);

  step(
    function () {
    io.readDir(src.paths.posts, this);
  },
  function (err, names) {
    if (err) {
      throw err;
    }

    var group = this.group();
    names.forEach(function (name) {
      addItem(name, src.paths, items, group());
    });
  },
  function (err, files) {
    if (err) {
      throw err;
    }

    result = rss({ items: items, channel: {
      date: src.dateString,
      title: src.header.title,
      description: src.header.description }
    });

    callback(null, src.path, src.name, result);
  }
  );
}

module.exports = {
  bake:bake,
  getItem:getItem
};
