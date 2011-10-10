/**
 * reader.js
 */

var File = require('./file.js'),
    fs = require('fs');

var read = function(path, callback) {
    readDir(path, function(files) {
        readFiles(files, callback);
    });
}

var readFiles = function(files, callback) {
    var i = 0;
    var length = files.length;

    (function next() {
        if (i < length) {
            readFile(files[i], next);
            i++;
        } else {
            callback(files)
        }
    }());
}

var readFile = function(file, callback) {
    fs.readFile(file.path, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        file.data = data;

        callback(file);
    });
}

var readDir = function(dirname, callback) {
    var files = [];

    fs.readdir(dirname, function(err, names) {
        if (err) {
            throw err;
        }

        var name;
        var i = names.length;

        while (i--) {
            name = names[i];
            files.push(new File(name, dirname + '/' + name));
        }

        callback(files);
    });
}

module.exports = {
    read:read
};