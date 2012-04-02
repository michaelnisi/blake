// Blake - Agnostic site bakery

// Require external dependencies.
var path = require('path');
var input = require('./input.js');
var io = require('./io.js');
var red = require('./color.js').red;

// The configuration, a user defined Node module.
var config;

// Generate and write output from input data from file with provided name.
var bakeFile = function(name, paths, callback) {
  // Require and set configuration.
  if (!config) {
    config = require(paths.config);
  }
  
  var src;
 
  // Read the input file. 
  io.readFile(name, function(err, file) {
    if (err) {
      return callback(err);
    }
    
    // Get the source object for this file from the input module.
    // In case of invalid input data return control.
    try {
      src = input.getSource(file, name, paths);
    } catch(err) {
      return callback(err);
    }

    // We know the template path now and load it.  
    io.readFile(src.templatePath, function(err, template) {
      if (err) {
        return callback(err);
      }
      
      var id, bake;
      
      // Reference template content to pass it to the view.
      src.template = template;
      
      // Find a bake function by using the template name as identifier.
      id = src.header.template;
      bake = config.bakeFunctions[id];
  
      // Return if the map doesn't refer a function by this id. 
      if (!bake) {
        return callback(new Error(id + '.bake(src, callback) not found.'));
      }
      
      // Apply view's bake function with the source object.
      console.log('Bake %s', src.filename);
      bake(src, function(err, p, name, result) {
        if (err) {
          return callback(err);
        }
        
        // If necessary create directories and write output file.
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
    if (err) {
      console.error(red('ERROR: %s'), err.message);
    }

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
// return. For example: ['input', 'output', 'input/about.md'] will only 
// generate the about page.
var bake = function(args, callback) {
  var inputPathName, outputPathName, names;
  
  inputPathName = args[0];
  outputPathName = args[1];
  names = args.slice(2);

  config = require(path.resolve(inputPathName, 'views', 'config.js'));

  var paths = input.getPaths(config, inputPathName, outputPathName);

  io.clearCache();
  
  // If we received specific filenames, return and generate only those.
  if (names.length) {
    return bakeFiles(names, paths, callback);
  }

  // Copy the static resources first to make it impossible to overwrite
  // generated output with static files.
  io.copyResources(paths.pathToResources, paths.outputPathName, function(err) {
    if (err) {
      return callback(err);
    }
    // Read the directory that contains the input data.
    io.readDir(paths.pathToData, function(err, names) {
      // Generate output from all input files, clear cache, and return control.
      bakeFiles(names, paths, function(err) {
        io.clearCache();
        return callback(err);
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
