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
    var header = data.getHeader(str);
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
var bake = function(filename, dir, target, callback) {
    console.log("rss.bake");
    return;
    var result, rss;
    var items = [];

    step(
        function() {
            console.log('Read %s', filename);
            fs.readFile(filename, 'utf8', this.parallel());
            fs.readdir(dir, this.parallel());
        },
        function(err, data, names) {
            if (err) {
                throw err;
            }
            rss = jade.compile(data, { filename:filename, pretty:true });
            var group = this.group();
            names.forEach(function(name) {
                addItem(dir + '/' + name, items, group());
            });
        },
        function(err, files) {
            if (err) {
                throw err;
            }
            result = rss({ items:items, channel:{ date:new Date().toGMTString() } });
            var filename = target + '/rss.xml';
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