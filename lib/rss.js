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
 * rss.js
 */

var step = require('step'),
    jade = require('jade'),
    fs = require('fs'),
    data = require('./data.js');


var getItem = function(filename, str) {
    var header = data.getSource(str).header;
    var date = filename.substr(0, filename.indexOf('_'));

    return {
        title:header.title,
        description:header.summary,
        link:header.path,
        date:new Date(date).toGMTString()
    };
};

var addItem = function(filename, items, callback) {
    console.log('Read %s', filename);
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        items.push(getItem(filename, data));
        callback(err, items);
    });
};

/**
 *
 * @param filename
 * @param dir
 * @param target
 * @param callback
 */
var bake = function(header, body, template, templateFilename, input, output, callback) {
    console.log("rss.bake");

    var items, result, rss;

    items = [];

    step(
        function() {
            fs.readdir(input + "/data", this);
        },
        function(err, names) {
            if (err) {
                throw err;
            }
            rss = jade.compile(template, { filename:templateFilename, pretty:true });
            var group = this.group;
            names.forEach(function(name) {
                if (name != 'rss.json') {
                    addItem(input + "/data" + '/' + name, items, group);
                }
            });
        },
        function(err, files) {
            if (err) {
                throw err;
            }
            result = rss({ items:items, channel:{ date:new Date().toGMTString() } });
            var filename = output + '/rss.xml';
            console.log('Write %s', filename);
            fs.writeFile(filename, result, this);
        },
        function(err) {
            callback(err, true);
        }
    );
};

module.exports = {
    bake:bake
};