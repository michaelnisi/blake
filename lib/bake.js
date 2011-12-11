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

var fs = require('fs'),
    step = require('step'),
    data = require('./data'),
    bakers = require('./bakers'),
    io = require('./io');

var OK = 'OK » baked';

var bakeFile = function(name, paths, callback) {
    var src;

    step(
        function() {
            var filename = paths.pathToData + name;
            io.readFile(filename, this);
        },
        function(err, file) {
            if (err) {
                throw err;
            }

            src = data.getSource(file, name, paths);

            io.readFile(src.templateFilename, this);
        },
        function(err, template) {
            if (err) {
                throw(err);
            }

            src.template = template;

            var bake = bakers[src.header.template];

            if (!bake) {
                callback();
                return;
            }

            bake(src, this);
        },
        function(err, p, name, result) {
            var ref = this;
            io.prepareDir(p, function(err) {
                io.writeFile(p, name, result, ref);
            });
        },
        function(err) {
            callback(err);
        }
    );
};

function getPaths(inputPathName, outputPathName) {
    return {
        inputPathName:inputPathName,
        outputPathName:outputPathName,
        pathToResources:inputPathName + '/resources/',
        pathToData:inputPathName + '/data/',
        templatesPathName:inputPathName + '/templates/'
    }
}

var bake = function(inputPathName, outputPathName, callback) {
    var paths = getPaths(inputPathName, outputPathName);

    step(
        function() {
            io.copyResources(paths.pathToResources, paths.outputPathName, this);
        },
        function(err) {
            fs.readdir(paths.pathToData, this);
        },
        function(err, names) {
            if (err) {
                throw err;
            }

            var group = this.group();
            names.forEach(function(name) {
                bakeFile(name, paths, group());
            });
        },
        function(err) {
            callback(err);
        }
    );
};

function main(arg) {
    if (!function() {
        return arg && arg.length == 2;
    }()) {
        console.error('Usage: node bake path/to/input path/to/output');
        return -1;
    }

    console.time(OK);

    bake(arg[0], arg[1], function(err) {
        if (err) {
            throw err;
        }

        console.timeEnd(OK);
    });

    return 0;
}

module.exports = {
    main:main,
    bake:bake,
    bakeFile:bakeFile
};
