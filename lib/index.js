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
 * index.js
 */

var step = require('step'),
    jade = require('jade'),
    fs = require('fs'),
    data = require('./data.js'),
    articles = require('./articles.js'),
    markdown = require('markdown').markdown,
    io = require('./io.js'),
    strings = require('./strings.js');

function getItem(filename, str, paths) {
    var date = new Date(filename.substr(0, filename.indexOf('_')));
    var src = data.getSource(str, filename, paths);

    if (!src) {
        return null;
    }

    var header = src.header;
    var body = strings.formatItemBody(src.body);

    return {
        title:header.title,
        description:header.description,
        content:markdown.toHTML(body),
        link:articles.getURL(src),
        date:date,
		time:date.getTime(),
		dateGMTString:date.toGMTString()
    };
}

function addItem(name, items, paths, callback) {
    var filename = paths.pathToData + name;

    io.readFile(filename, function(err, data) {
        if (err) {
            throw err;
        }
        items.push(getItem(name, data, paths));
        callback(err, items);
    });
}

function descendingByDate(a, b) {
	return (a.time - b.time) * -1;
}

function bake(src, callback) {
    console.log("Bake Index");

    var items, result, jadeCompile;

    items = [];
    jadeCompile = jade.compile(src.template, { filename:src.templateFilename, pretty:true });

    step(
        function() {
            fs.readdir(src.paths.pathToData, this);
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

			items.sort(descendingByDate);

            result = jadeCompile({
                title:src.header.title,
                items:items,
                date:strings.formatDate(items[0].date)
            });

            callback(null, src.paths.outputPathName, 'index.html', result);
        }
    );
}

module.exports = {
    bake:bake,
    getItem:getItem
};
