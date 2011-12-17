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
    io = require('./io.js'),
    data = require('./data.js'),
    markdown = require('markdown').markdown;

function getItem(file, filename, paths) {
    var date = filename.substr(0, filename.indexOf('_'));
    var src = data.getSource(file, filename, paths);

    if (!src) {
        return null;
    }

    var summary = '<h4>' + src.header.description + '</h4>';

    return {
        title:src.header.title,
        description:src.header.description,
        content: summary + markdown.toHTML(src.body),
        link:src.header.path,
        date:new Date(date).toGMTString()
    };
}

function addItem(paths, filename, items, callback) {
    io.readFile(paths.pathToData + filename, function(err, data) {
        if (err) {
            throw err;
        }
        items.push(getItem(data, filename, paths));
        callback(err, items);
    });
}

function bake(src, callback) {
    console.log("Bake RSS");

    var items, result, rss;

    items = [];
    rss = jade.compile(src.template, { filename:src.templateFilename, pretty:true });

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
                    addItem(src.paths, name, items, group());
                }
            });
        },
        function(err, files) {
            if (err) {
                throw err;
            }
            result = rss({ items:items, channel:getChannel(src) });
            callback(null, src.paths.outputPathName, 'rss.xml', result);
        }
    );
}

function getChannel(src) {
    var channel = {};

    channel.date = new Date().toGMTString();
    channel.title = src.header.title;
    channel.description = src.header.description;

    return channel;
}

module.exports = {
    bake:bake,
    getItem:getItem
};