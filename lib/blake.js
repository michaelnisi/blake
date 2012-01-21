/*
 * Copyright (C) 2012 by Michael Nisi
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
    input = require('./input.js'),
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

            src = input.getSource(file, name, paths);

            io.readFile(src.templatePath, this);
        },
        function(err, template) {
            if (err) {
                throw(err);
            }

			var id, bake;

            src.template = template;

			id = src.header.template;
            bake = config.bakers[id];

            if (!bake) {
				throw('%s.bake(src, callback) not found.', id);
            }
			
			console.log('Bake %s', src.filename);
            bake(src, this);
        },
        function(err, p, name, result) {
			if (err) {
				throw(err);
			}

            var ref = this;
            io.prepareDir(p, function(err) {
                io.writeFile(p, name, result, ref);
            });
        },
        function(err) {
			if (err) {
				throw(err);
			}
            callback(err);
        }
    );
};

var bake = function(inputPathName, outputPathName, callback) {
    var paths = input.getPaths(config, inputPathName, outputPathName);

    step(
        function() {
            io.copyResources(paths.pathToResources, paths.outputPathName, this);
        },
        function(err) {
			if (err) {
				throw(err);
			}

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

module.exports = {
    bake:bake
};
