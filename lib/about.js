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

var jade = require('jade'),
    markdown = require('markdown').markdown,
    strings = require('./strings.js');

function bake(src, callback) {
    console.log("Bake Article: %s", src.filename);

	var jadeCompile = jade.compile(src.template, { filename:src.templateFilename, pretty:true });
	var item = getItem(src);
    var result = jadeCompile(item);
    var name = src.header.name;
    var path = src.path;

    callback(null, path, name, result);
}

function getItem(src) {
    var header = src.header;
    var body = strings.formatItemBody(src.body);

    return {
        title:header.title,
        description:header.description,
        content:markdown.toHTML(body),
        dateString:strings.formatDate(src.date)
    };
}

module.exports = {
    bake:bake
};
