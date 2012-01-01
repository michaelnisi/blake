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

var step = require('step');
var jade = require('jade');
var io = require('./io.js');
var input = require('./input.js');
var markdown = require('markdown').markdown;

function getItem(file, filename, paths) {
    var date = filename.substr(0, filename.indexOf('_'));
    var src = input.getSource(file, filename, paths);

    if (!src) {
        return null;
    }

    var summary = '<h4>' + src.header.description + '</h4>';

    return {
        title: src.header.title,
        description: src.header.description,
        content: summary + markdown.toHTML(src.body),
        link: src.link,
        date: src.dateString
    };
}

function addItem(name, paths, items, callback) {
    io.readFile(name, function(err, data) {
        if (err) {
            throw err;
        }
        items.push(getItem(data, name, paths));
        callback(err, items);
    });
}

function bake(src, callback) {
	var items, result, options, rss;

    options = { filename: src.templatePath, pretty: true };
    items = [];
    rss = jade.compile(src.template, options);

    step(
        function() {
            io.readDirRec(src.paths.posts, this);
        },
        function(err, names) {
            if (err) {
                throw err;
            }

            var group = this.group();
            names.forEach(function(name) {
                addItem(name, src.paths, items, group());
            });
        },
        function(err, files) {
            if (err) {
                throw err;
            }

            result = rss({ items: items, channel: {
                date: src.dateString,
                title: src.header.title,
                description: src.header.description }
            });

            callback(null, src.path, src.name, result);
        }
    );
}

module.exports = {
    bake:bake,
    getItem:getItem
};
