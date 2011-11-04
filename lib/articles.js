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

var step = require('step'),
    jade = require('jade'),
    markdown = require('markdown').markdown,
    highlight = require('highlight').Highlight;

function bake(src, callback) {
    console.log("Bake Article: %s", src.filename);

    var articleHTML = markdown.toHTML(src.body);
    var toHTML = getJadeCompile(src.template, src.templateFilename);
    var html = toHTML({ title:src.header.title, article:articleHTML });
    var result = highlightHTML(html);
    var name = 'index.html';
    var p = getPath(src);

    callback(null, p, name, result);
}

function getURL(src) {
    var a = src.filename.split('_');
    var b = a[0].split('-');

    return '/' + b.concat(a[1].split('.')[0]).join('/');
}

function getPath(src) {
    return src.paths.outputPathName + getURL(src);
}

function getJadeCompile(str, filename) {
    return jade.compile(str, { filename:filename });
}

function highlightHTML(html) {
    return html.replace(/<pre><code>[^<]+<\/code><\/pre>/g,
        function applyHighlight(code) {
            return "<pre><code>" + highlight(code.match(/<code>([\s\S]+)<\/code>/)[1]) + "</code></pre>";
        }
    );
}

module.exports = {
    bake:bake,
    getPath:getPath,
    getURL:getURL
};