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
 * data.js contains input data related stuff.
 */

var rss = require('./rss.js'),
    articles = require('./articles.js');

var END_MARKER = '$end';

function getSource(file, filename, paths) {
    var data, header, body, src;

    data = file.split(END_MARKER);
    header = JSON.parse(data[0] || null);
    body = data[1];

    if (!header) {
        throw(new Error('Header required.'));
    }

    src = {
        header:header,
        body:body,
        filename:filename,
        paths:paths,
        templateFilename: paths ? paths.templatesPathName + header.template : null,
        template:null
    };

    return src;
};
exports.getSource = getSource;

exports.isArticleName = function(str) {
    return str.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/) === 0;
}

exports.generatorsByTemplate = {
    'rss.jade':rss.bake,
    'article.jade':articles.bake
};

