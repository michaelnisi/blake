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
 * articles.js
 */

var jade = require('jade'),
    markdown = require('markdown').markdown,
    strings = require('./strings');

function bake(src, callback) {
    console.log("Bake Article: %s", src.filename);

	var jadeCompile = jade.compile(src.template, { filename:src.templateFilename, pretty:true });

	var item = getItem(src);
	
    var result = jadeCompile(item);
    var name = 'index.html';
    var p = getPath(src);

    callback(null, p, name, result);
}

function getItem(src) {
    var filename = src.filename;
    var date = new Date(filename.substr(0, filename.indexOf('_')));

    var header = src.header;
    var body = strings.formatItemBody(src.body);

    return {
        title:header.title,
        description:header.description,
        content:markdown.toHTML(body),
        link:getURL(src),
        date:date,
		time:date.getTime(),
		dateGMTString:date.toGMTString()
    };
}

function getURL(src) {
    var a = src.filename.split('_');
    var b = a[0].split('-');

    return '/' + b.concat(a[1].split('.')[0]).join('/');
}

function getPath(src) {
    return src.paths.outputPathName + getURL(src);
}

module.exports = {
    bake:bake,
    getPath:getPath,
    getURL:getURL,
    getItem:getItem
};
