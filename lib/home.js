// The home.js module renders the home page.

var step = require('step');
var jade = require('jade');
var input = require('./input.js');
var articles = require('./article.js');
var io = require('./io.js');

// Add item to specified items array.
var addItem = function(name, items, paths, callback) {
  io.readFile(name, function(err, file) {
    if (err) {
      throw err;
    }
    var src = input.getSource(file, name, paths);
    var item = articles.getJadeLocals(src);
    items.push(item);
    callback(err, items);
  });
};

// Bake the home page.
var bake = function(src, callback) {
  var items, result, options, jadeCompile;

  items = [];
  options = { filename: src.templatePath, pretty: true };
  jadeCompile = jade.compile(src.template, options);

  step(
    function() {
      io.readDir(src.paths.posts, this);
    },
    function(err, names) {
      if (err) {
        throw err;
      }

      var group = this.group();
      names.forEach(function(name) {
        addItem(name, items, src.paths, group());
      });
    },
    function(err, files) {
      if (err) {
        throw err;
      }

      items.sort(function(a, b) { // descending by time
        return (a.time - b.time) * -1;
      });

      var latestItem = items[0];

      result = jadeCompile({
        mainNavigationItems: src.header.menu,
        title: src.header.title,
        items: items,
        dateString: latestItem ? latestItem.dateString : src.dateString
      });

      callback(null, src.path, src.name, result);
    }
  );
};

module.exports = {
  bake:bake
};
