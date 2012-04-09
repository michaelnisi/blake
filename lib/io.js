// This module provides functions to deal with IO.

// Require external dependencies.
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var fstream = require('fstream');
var mkdirp = require('mkdirp');
var createHash = require('crypto').createHash;
var spawn = require('child_process').spawn;

// Cache to store all things we read.
var cache;

// Clear the cache.
var clearCache = function () {
  cache = Object.create(null);
};

// Spawn child process with specified path and execute git pull.
var pull = function (path, callback) {
  spawn('git', ['pull'], { cwd:path }).on('exit', function (code) {
    return callback(code === 0 ? null : new Error(code));
  });
};

// Create md5 hash for specified string and return hex encoded digest.
var hash = function (str) {
  return createHash('md5').update(str).digest('hex');
};

// If the specified path is cached, apply callback with the cached array 
// of filenames and return control; else read the directories in the path
// to collect and cache all the filenames in the path. Apply callback with
// the collected filenames.
var readDir = function (p, callback) {
  if (!cache) clearCache();

  var id = hash(path.resolve(p));
  var cached = cache[id];

  if (cached && cached.length) {
    return callback(null, cached);
  }

  function addPath(entry) {
    if (entry.type === 'File') {
      paths.push(entry.path);
    }
    
    entry.on('entry', addPath);
  }

  var reader = fstream.Reader(p);
  reader.on('entry', addPath);

  var paths = [];
  cache[id] = paths;

  reader.on('end', function () {
    callback(null, paths);
  });
};

// If file is cached apply callback and return, else read data from file,
// cache it, and apply callback with data.
var readFile = function (filename, callback) {
  if (!cache) clearCache();

  var id = hash(filename);
  var cachedFile = cache[id];
  
  if (cachedFile) {
    return callback(null, cachedFile);
  }

  console.log('Read %s', filename);
  fs.readFile(filename, 'utf8', function (err, data) {
    cache[id] = data;
    callback(err, data);
  });
};

// Read input directory and initialize an array to store the files. Iterate
// over the read filenames to read each file and push the data into the 
// files array. Apply callback.
var readFiles = function (path, callback) {  
  readDir(path, function (err, names) {
    if (err) {
      throw err;
    }

    var files, length;
     
    files = [];
    length = names.length;

    names.forEach(function (name) {
      readFile(name, function (err, file) {
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
var writeFile = function (p, name, data, callback) {
  var resolvedPath = path.resolve(p, name);
  console.log('Write %s', resolvedPath);
  fs.writeFile(resolvedPath, data, callback);
};

// Copy resources from input to output.
var copyResources = function (input, output, callback) {
  console.log('Copy resources from %s to %s', input, output);
  
  if (!input || !output) {
    return callback(null);
  }

  var reader = fstream.Reader(input); 
  var writer = fstream.Writer({ path:output, type:'Directory' });
  
  reader.on('error', callback);
  writer.on('error', callback);

  writer.on('ready', function () {
    writer.on('end', function () {
      callback(null);
    });
  });

  reader.pipe(writer);
};

// Create directory if it does not exist yet.
var prepareDir = function (p, callback) {
  path.exists(p, function (exists) {
    if (!exists) {
      mkdirp(p, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  });
};

// Export API.
module.exports = {
  readFile: readFile,
  readFiles: readFiles,
  writeFile: writeFile,
  copyResources: copyResources,
  prepareDir: prepareDir,
  readDir: readDir,
  clearCache: clearCache,
  pull: pull
};
