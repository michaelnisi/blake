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
    jade = require('jade'),
    data = require('./data.js'),
    articles = require('./article.js'),
    io = require('./io.js');

function addItem(name, items, paths, callback) {
    var filename = paths.pathToData + name;

    io.readFile(filename, function(err, file) {
        if (err) {
            throw err;
        }
        var src = data.getSource(file, name, paths);
        var item = articles.getJadeLocals(src);
        items.push(item);
        callback(err, items);
    });
}

function bake(src, callback) {
    console.log("Bake Index");

    var items, result, jadeCompile;

    items = [];
    jadeCompile = jade.compile(src.template, { filename:src.templateFilename, pretty:true });

    step(
        function() {
            io.readDir(src.paths.pathToData, this);
        },
        function(err, names) {
            if (err) {
                throw err;
            }

            var group = this.group();
            names.forEach(function(name) {
                if (data.isArticleName(name)) {
                    addItem(name, items, src.paths, group());
                }
            });
        },
        function(err, files) {
            if (err) {
                throw err;
            }

			items.sort(function(a, b) {
	            return (a.time - b.time) * -1;
            });

            result = jadeCompile({
                mainNavigationItems:src.header.menu,
                title:src.header.title,
                items:items,
                dateString:items[0].dateString
            });

            callback(null, src.paths.outputPathName, src.header.name, result);
        }
    );
}

module.exports = {
    bake:bake
};