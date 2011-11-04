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
    data = require('./data'),
    bakers = require('./bakers'),
    path = require('path');

var cache = {};

var bakeFile = function(name, paths, callback) {
    var src;

    step(
        function() {
            var filename = paths.pathToData + name;

            // TODO Cache
            console.log('Read %s', name);
            fs.readFile(filename, 'utf8', this);
        },
        function(err, file) {
            if (err) {
                throw err;
            }

            src = data.getSource(file, name, paths);

            // TODO Cache
            fs.readFile(src.templateFilename, 'utf8', this);
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
            prepareDir(p, function(err) {
                var filename = path.resolve(p, name);
                console.log('Write %s', p + '/' + name);
                fs.writeFile(filename, result, ref);
            });
        },
        function(err) {
            callback(err);
        }
    );
};

function prepareDir(p, callback) {
    path.exists(p, function(exists) {
        if (!exists) {
            var cmd = 'mkdir -p ' + p;
            var child = exec(cmd, function(err) {
                callback(err);
                child.kill();
            });
        } else {
            callback(null);
        }
    });
}

function say() {
    return 'cool'
}

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
            copyResources(paths.pathToResources, paths.outputPathName, this);
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
    if (!arg || arg.length !== 2) {
        console.error('Usage: node bake path/to/input path/to/output');
        return -1;
    }

    var OK = 'OK » baked';

    console.time(OK);

    var input = arg[0];
    var output = arg[1];

    bake(input, output, function(err) {
        if (err) {
            throw err;
        }

        console.timeEnd(OK);
    });
    
    return 0;
}

function copyResources(path, targetPath, callback) {
    console.log('Copy resources from %s to %s.', path, targetPath);
    var cmd = 'rm -r ' + targetPath + ' ; ' + 'cp -r ' + path + ' ' + targetPath;
    var child = exec(cmd, function(err) {
        callback(err);
        child.kill();
    });
}

module.exports = {
    main:main,
    bake:bake,
    copyResources:copyResources,
    bakeFile:bakeFile,
    prepareDir:prepareDir,
    say:say
};
