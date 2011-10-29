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

/**
 * bake.js
 */

var exec = require('child_process').exec,
    fs = require('fs'),
    step = require('step'),
    data = require('./data');

var OK = 'OK » baked';

var compile = function(filename, templatesPathName, outputPathName, callback) {
    console.log('Read %s', filename);

    var header, body;

    step(
        function() {
            fs.readFile(filename, 'utf8', this);
        },
        function(err, file) {
            if (err) {
                throw err;
            }

            header = data.getHeader(file);
            body = data.getBody(file);

            fs.readFile(templatesPathName + header.template, 'utf8', this);
        },
        function(err, template) {
            if (err) {
                throw(err);
            }

            var bake = data.generatorsByTemplate[header.template];

            // Here we go!
            bake(header, body, template, outputPathName);

            // Done.
            callback(err);
        }
    );
};

var bake = function(inputPathName, outputPathName, callback) {
    var pathToData = inputPathName + '/data/';
    var templatesPathName = inputPathName + '/templates/';

    step(
        function() {
            fs.readdir(pathToData, this);
        },
        function(err, names) {
            if (err) {
                throw err;
            }

            var group = this.group;
            names.forEach(function(name) {
                compile(pathToData + name, templatesPathName, outputPathName, group);
            });
        },
        function(err) {
            callback(err, true);
        }
    );
};

var main = function(arg) {
    if (!arg || arg.length < 2) {
        console.error('Usage: node bake path/to/input path/to/output');
        return -1;
    }

    var input = arg[0];
    var output = arg[1];

    bake(input, output, function(err) {
        if (err) {
            throw err;
        }
    });

    return 0;
};

var copyResources = function(path, targetPath, callback) {
    var cmd = 'rm -r ' + targetPath + ' ; ' + 'cp -r ' + path + ' ' + targetPath;

    var child = exec(cmd, function(err) {
        if (!err) {
            console.log('Copied files from %s to %s.', path, targetPath);
        }
        child.kill();
        callback(err);
    });
};

module.exports = {
    main:main,
    cp:copyResources
};
