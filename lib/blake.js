// [Blake](http://michaelnisi.github.com/blake/) is a view agnostic, blog aware
// static site generator.

// Require external dependencies.
var path = require('path');
var input = require('./input.js');
var io = require('./io.js');

// The configuration, a user defined Node module.
var config;

// Sequence steps to generate on file.
var bakeFile = function(name, paths, callback) {
  // Require and set configuration.
  if (!config) {
    config = require(paths.config);
  }
  
  var src;
  
  io.readFile(name, function(err, file) {
    if (err) {
      return callback(err);
    }

    src = input.getSource(file, name, paths);

    io.readFile(src.templatePath, function(err, template) {
      if (err) {
        return callback(err);
      }
      
      var id, bake;

      src.template = template;

      id = src.header.template;
      bake = config.bakeFunctions[id];

      if (!bake) {
        return callback(new Error(id + '.bake(src, callback) not found.'));
      }

      console.log('Bake %s', src.filename);
      bake(src, function(err, p, name, result) {
        if (err) {
          return callback(err);
        }

        io.prepareDir(p, function(err) {
          io.writeFile(p, name, result, function(err) {
            return callback(err);
          });
        });
      });
    });
  });
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

// Receive arguments and require configuration module, we are expecting to find
// it under pathToInput/views/config.js. Get the paths object for the 
// configuration, input and output path. Clear (initialize) IO cache.
// If specific filenames have been passed as arguments, only generate these and
// return. For example: ['input', 'output', 'input/about.md'] will just generate
// the about page.
var bake = function(args, callback) {
  var inputPathName, outputPathName, names;
  
  inputPathName = args[0];
  outputPathName = args[1];
  names = args.slice(2);

  config = require(path.resolve(inputPathName, 'views', 'config.js'));

  var paths = input.getPaths(config, inputPathName, outputPathName);

  io.clearCache();

  if (names.length) {
    return bakeFiles(names, paths, callback);
  }

  io.copyResources(paths.pathToResources, paths.outputPathName, function(err) {
    if (err) {
      return callback(err);
    }
    io.readDir(paths.pathToData, function(err, names) {
      bakeFiles(names, paths, function(err) {
        io.clearCache();
        callback(err);
      });   
    });
  });
};

// Export API.
module.exports = {
  bake: bake,
  getPaths: input.getPaths,
  getSource: input.getSource,
  readFiles: io.readFiles,
  readDir: io.readDir
};
