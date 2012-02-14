// Blake helps to generate static sites.
// TODO: We probably should get rid off the dependency to step.

// Require external dependencies.
var step = require('step');
var path = require('path');
var input = require('./lib/input.js');
var io = require('./lib/io.js');

// The configuration, a user defined Node module.
var config;

// Sequence steps to generate on file.
var bakeFile = function(name, paths, callback) {
  // Require and set configuration.
  if (!config) {
    config = require(paths.config);
  }

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

// Iterate over names and call the bake file method for each name. 
// Apply callback when all files are baked.
var bakeFiles = function(names, paths, callback) {
  var l, i, done;
  
  l = i = names.length;

  done = function(err) {
    if (--l === 0) {
      return callback(err); 
    } 
  };

  while (i--) {
    bakeFile(names[i], paths, done);
  } 
};

// Generate all output from input.
var bake = function(inputPathName, outputPathName, callback) {
  config = require(inputPathName + '/views/config.js');

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
  bake: bake,
  bakeFiles: bakeFiles,
  getPaths: input.getPaths,
  readFile: io.readFile,
  readFiles: io.readFiles,
  getSource: input.getSource,
  readDir: io.readDir
};
