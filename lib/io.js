/*
 * Copyright (C) 2011 by Michael Nisi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var cache = {};

function readDir(path, callback) {
    var cachedFiles = cache[path];

    if (cachedFiles) {
        callback(null, cachedFiles);
        return;
    }

    console.log('Read %s', path);
    fs.readdir(path, function(err, files) {
        cache[path] = files;
        callback(err, files);
    });
}

function readFile(filename, callback) {
    var cachedFile = cache[filename];

    if (cachedFile) {
        callback(null, cachedFile);
        return;
    }

    console.log('Read %s', filename);
    fs.readFile(filename, 'utf8', function(err, data) {
        cache[filename] = data;
        callback(err, data);
    });
}

function writeFile(p, name, data, callback) {
    console.log('Write %s', p + '/' + name);
    fs.writeFile(path.resolve(p, name), data, callback);
}

function copyResources(path, targetPath, callback) {
    console.log('Copy resources from %s to %s.', path, targetPath);
    var cmd = 'rm -r ' + targetPath + ' ; ' + 'cp -r ' + path + ' ' + targetPath;
    var child;

    child = exec(cmd, function(err) {
        callback(err);
        child.kill();
    });
}

function prepareDir(p, callback) {
	path.exists(p, function(exists) {
        if (!exists) {
            var cmd = 'mkdir -p ' + p;
            var child;
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
    readDir:readDir,
    copyResources:copyResources,
    prepareDir:prepareDir
};