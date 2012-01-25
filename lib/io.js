// This module provides methods to deal with IO.

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;


// Cache to store all things already read.
var cache; 

// Clear the cache.
function clearCache () {
	cache = Object.create(null);
}

// Initialize cache.
clearCache();

// Read directory and store result in cache.
function readDirAndCache (path, callback) {
	var cachedFiles = cache[path];

	if (cachedFiles) {
		callback(null, cachedFiles);
		return;
	}

	console.log('Read %s', path);
	fs.readdir(path, function (err, files) {
		cache[path] = files;
		callback(err, files);
	});
}

// Recursively read directories.
function readDir (p, callback) {
	var results = [];
	readDirAndCache(p, function (err, files) {
		if (err) {
			return callback(err);
		}

		var pending = files.length;

		if (!pending) {
			return callback(null, results);
		}

		files.forEach(function (file) {
			file = p + '/' + file;
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					readDir(file, function (err, res) {
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

// Read file and store result in cache.
function readFile (filename, callback) {
	var cachedFile = cache[filename];

	if (cachedFile) {
		callback(null, cachedFile);
		return;
	}

	console.log('Read %s', filename);
	fs.readFile(filename, 'utf8', function (err, data) {
		cache[filename] = data;
		callback(err, data);
	});
}

// Write data to file.
function writeFile (p, name, data, callback) {
	var resolvedPath = path.resolve(p, name);
	console.log('Write %s', resolvedPath);
	fs.writeFile(resolvedPath, data, callback);
}

// Copy static resources from input to output.
function copyResources (path, targetPath, callback) {
	console.log('Copy resources from %s to %s.', path, targetPath);
	var cmd = 'rm -r ' + targetPath + ' ; ' + 'cp -r ' + path + ' ' + targetPath;
	var child;

	child = exec(cmd, function (err) {
		callback(err);
		child.kill();
	});
}

// Create directory if it does not yet exist.
function prepareDir (p, callback) {
	path.exists(p, function (exists) {
		if (!exists) {
			var cmd = 'mkdir -p ' + p;
			var child;
			child = exec(cmd, function (err) {
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
