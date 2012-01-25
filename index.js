// Blake is a [Node.js](http://nodejs.org/) module, that combines
// [markdown](http://daringfireball.net/projects/markdown/), 
// [jade](http://jade-lang.com/) templates and static resources to produce
// structured file artifacts. It can be used from the command line or as
// library.

var step = require('step');
var input = require('./lib/input.js');
var io = require('./lib/io.js');
var config = require('./lib/config.js');

// Bakes a single output file from a single input file.
var bakeFile = function (name, paths, callback) {
  var src;

  step(
    function () {
      io.readFile(name, this);
    },
    function (err, file) {
      if (err) {
        throw err;
      }

      src = input.getSource(file, name, paths);

      io.readFile(src.templatePath, this);
    },
    function (err, template) {
      if (err) {
        throw err;
      }

      var id, bake;

      src.template = template;

      id = src.header.template;
      bake = config.bakeFunctions[id];

      if (!bake) {
        throw new Error(id + '.bake(src, callback) not found.');
      }

      console.log('Bake %s', src.filename);
      bake(src, this);
    },
    function (err, p, name, result) {
      if (err) {
        throw err;
      }

      var ref = this;
      io.prepareDir(p, function (err) {
        io.writeFile(p, name, result, ref);
      });
    },
    function (err) {
      if (err) {
        throw err;
      }
      callback(err);
    }
  );
};

// Bakes multiple output files from multiple input files parallely.
var bakeFiles = function (names, paths, callback) {
  step(
    function () {
      var group = this.group();
      names.forEach(function (name) {
        bakeFile(name, paths, group());
      });
    },
    function (err) {
      callback(err);
    }
  );	
};

// Copies static resources, reads input data directory and bakes files.
var bake = function (inputPathName, outputPathName, callback) {
  var paths = input.getPaths(config, inputPathName, outputPathName);

  io.clearCache();

  step(
    function () {
      io.copyResources(paths.pathToResources, paths.outputPathName, this);
    },
    function (err) {
      if (err) {
        throw err;
      }

      io.readDir(paths.pathToData, this);
    },
    function (err, names) {
      if (err) {
        throw err;
      }

      bakeFiles(names, paths, this);
    },
    function (err) {
      callback(err);
    }
  );
};

module.exports = {
  bake:bake,
  bakeFiles:bakeFiles,
  getPaths:input.getPaths
};

