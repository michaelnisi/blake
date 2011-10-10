/**
 * writer.js
 */

var fs = require('fs');

var write = function(files, callback) {
    writeFiles(files, callback);
}

var writeFile = function(file, callback) {
    fs.writeFile(file.path, file.data, function(err) {
        if (err) {
            throw err;
        }

        callback(file);
    });
};

var writeFiles = function(files, callback) {
    var i = 0;
    var length = files.length;

    (function next() {
        if (i < length) {
            writeFile(files[i], next);
            i++;
        } else {
            callback(files)
        }
    }());
};

module.exports = {
    write:write
};
