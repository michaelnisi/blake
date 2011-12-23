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

var step = require('step'),
    data = require('./input.js'),
    io = require('./io.js'),
    config = require('./config.js');

var bakeFile = function(name, paths, callback) {
    var src;

    step(
        function() {
            io.readFile(name, this);
        },
        function(err, file) {
            if (err) {
                throw err;
            }

            src = data.getSource(file, name, paths);

            io.readFile(src.templatePath, this);
        },
        function(err, template) {
            if (err) {
                throw(err);
            }

            src.template = template;

            var bake = config.bakers[src.header.template];

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

var bake = function(inputPathName, outputPathName, callback) {
    var paths = data.getPaths(config, inputPathName, outputPathName);

    step(
        function() {
            io.copyResources(paths.pathToResources, paths.outputPathName, this);
        },
        function(err) {
            io.readDirRec(paths.pathToData, this);
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

function main(arg, bakers) {
    if (!function() {
        // TODO Check if arg[0] and arg[1] are directories
        return arg && arg.length == 2;
    }()) {
        console.error('Usage: blake path/to/input path/to/output');
        return -1;
    }

    var ok = 'OK » baked';

    console.time(ok);

    bake(arg[0], arg[1], function(err) {
        if (err) {
            throw err;
        }

        console.timeEnd(ok);
    });

    return 0;
}

module.exports = {
    main:main
};