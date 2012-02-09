// This module provides methods to deal with IO.

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

// Cache to store all things we read.
var cache; 

// Clear the cache.
function clearCache() {
	cache = Object.create(null);
}

// Initialize cache.
clearCache();

// If directory is not in cache yet, read directory from disk and store result
// in cache.
function readDirAndCache(path, callback) {
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

// Recursively read directories in given path.
function readDir(p, callback) {
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

// If file is not in cache yet, read data from file and store result in cache.
function readFile(filename, callback) {
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

// Resolve path and write data to file.
function writeFile(p, name, data, callback) {
	var resolvedPath = path.resolve(p, name);
	console.log('Write %s', resolvedPath);
	fs.writeFile(resolvedPath, data, callback);
}

// Copy static resources from input to output.
function copyResources(path, targetPath, callback) {
	console.log('Copy resources from %s to %s.', path, targetPath);
  var cmd, child;

	cmd = 'rm -r ' + targetPath + ' ; ' + 'cp -r ' + path + ' ' + targetPath;

	child = exec(cmd, function(err) {
		callback(err);
		child.kill();
	});
}

// Create directory if it does not exist yet.
function prepareDir(p, callback) {
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

module.exports = {
	readFile:readFile,
	writeFile:writeFile,
	copyResources:copyResources,
	prepareDir:prepareDir,
	readDir:readDir,
	clearCache:clearCache
};
