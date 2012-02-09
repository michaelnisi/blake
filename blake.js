// Blake is a static site generator for [Node](http://nodejs.org/). It combines
// [Markdown](http://daringfireball.net/projects/markdown/) markup, 
// [jade](http://jade-lang.com/) templates and static resources to produce 
// structured file artifacts. Blake can be used from the command line or as a
// library.

// Require external dependencies.
var step = require('step');
var input = require('./lib/input.js');
var io = require('./lib/io.js');
var config = require('./lib/config.js');

// Sequence steps to generate on file.
var bakeFile = function(name, paths, callback) {
  var src;

  step(
    // Read the input file.
    function() {
      io.readFile(name, this);
    },
    // Parse its contents into a source object and read the template,
    // originally specified in the input file header, now stored in the 
    // source object.
    function(err, file) {
      if (err) {
        throw err;
      }

      src = input.getSource(file, name, paths);

      io.readFile(src.templatePath, this);
    },
    // Call the bake function referenced by an id that matches our template
    // name. The config module provides a dictionary of bake functions by 
    // template names. 
    function(err, template) {
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
    // If necessary create output directory and write output file to it.
    function(err, p, name, result) {
      if (err) {
        throw err;
      }

      var ref = this;
      io.prepareDir(p, function(err) {
        io.writeFile(p, name, result, ref);
      });
    },
    // Apply callback function.
    function(err) {
      if (err) {
        throw err;
      }
      callback(err);
    }
  );
};

// Sequence steps to generate multiple files.
var bakeFiles = function(names, paths, callback) {
  step(
    function() {
      var group = this.group();
      names.forEach(function(name) {
        bakeFile(name, paths, group());
      });
    },
    // Apply callback.
    function(err) {
      callback(err);
    }
  );	
};

// Generate all output from input.
var bake = function(inputPathName, outputPathName, callback) {
  var paths = input.getPaths(config, inputPathName, outputPathName);

  io.clearCache();

  step(
    // Copy static resources from input to output path.
    function() {
      io.copyResources(paths.pathToResources, paths.outputPathName, this);
    },
    // Read input data directory.
    function(err) {
      if (err) {
        throw err;
      }

      io.readDir(paths.pathToData, this);
    },
    // Generate output from all read input data files.
    function(err, names) {
      if (err) {
        throw err;
      }

      bakeFiles(names, paths, this);
    },
    // Apply callback.
    function(err) {
      callback(err);
    }
  );
};

// Export API.
module.exports = {
  bake:bake,
  bakeFiles:bakeFiles,
  getPaths:input.getPaths
};

