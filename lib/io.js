// This module provides methods to deal with IO.

// Require external dependencies.
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

// Cache to store all things we read.
var cache;

// Clear the cache.
var clearCache = function() {
  cache = Object.create(null);
}

// Initialize cache.
clearCache();

// If directory is not in cache yet, read directory from disk and store result
// in cache. Apply callback with cached directory.
var readDirAndCache = function(path, callback) {
	var cachedFiles = cache[path];

	if (cachedFiles) {
	  return callback(null, cachedFiles);
	}

	console.log('Read %s', path);
	fs.readdir(path, function(err, files) {
		cache[path] = files;
		callback(err, files);
	});
}

// Initialize results array. Recursively read and cache directories. Apply 
// callback with result array, containing all files in the given directory 
// tree.
var readDir = function(p, callback) {
	var results = [];

	readDirAndCache(p, function(err, files) {
		if (err) {
			return callback(err);
		}

		var pending = files.length;

		if (!pending) {
			return callback(null, results);
		}

		files.forEach(function(file) {
			file = p + '/' + file;
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					readDir(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) {
						  callback(null, results);
						}
					});
				} else { 
					if (path.basename(file).charAt(0) !== '.') {
						results.push(file);
					}

					if (!--pending) {
						callback(null, results);
					}
				}
			});
		});
	});
}

// Check if file is in cache, if so, apply callback with cached file; else read
// data from file, cache it and apply callback with data.
var readFile = function(filename, callback) {
	var cachedFile = cache[filename];

	if (cachedFile) {
	  return callback(null, cachedFile);
	}

	console.log('Read %s', filename);
	fs.readFile(filename, 'utf8', function(err, data) {
		cache[filename] = data;
		callback(err, data);
	});
}

// Read input directory and initialize an array to store the files. Iterate
// over the read filenames to read each file and push the data into the files 
// array. Apply callback.
var readFiles = function(path, callback) {  
  readDir(path, function(err, names) {
    if (err) {
      throw err;
    }

    var files, length;
     
    files = [];
    length = names.length;

    names.forEach(function(name) {
      readFile(name, function(err, file) {
        if (err) {
          throw err;
        }

        files.push({ name: name, content: file });
        
        if (files.length === length) {
          callback(null, files);
        }
      });
    });
  });
};

// Resolve path and write data to file.
var writeFile = function(p, name, data, callback) {
	var resolvedPath = path.resolve(p, name);
	console.log('Write %s', resolvedPath);
	fs.writeFile(resolvedPath, data, callback);
};

// Copy static resources from input to output.
var copyResources = function(path, targetPath, callback) {
	console.log('Copy resources from %s to %s.', path, targetPath);
  var cmd, child;

	cmd = 'rm -r ' + targetPath + ' ; ' + 'cp -r ' + path + ' ' + targetPath;

	child = exec(cmd, function(err) {
		callback(err);
		child.kill();
	});
};

// Create directory if it does not exist yet.
var prepareDir = function(p, callback) {
	path.exists(p, function(exists) {
		if (!exists) {
			var cmd, child;
      
      cmd = 'mkdir -p ' + p;
			child = exec(cmd, function(err) {
				callback(err);
				child.kill();
			});
		} else {
			callback(null);
		}
	});
}

// Export API.
module.exports = {
	readFile: readFile,
  readFiles: readFiles,
	writeFile: writeFile,
	copyResources: copyResources,
	prepareDir: prepareDir,
	readDir: readDir,
	clearCache: clearCache
};
