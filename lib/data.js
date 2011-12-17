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

var END_MARKER = '$end';
var HEADER_REQUIRED = 'Header required.';
var IS_ARTICLE_NAME = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/;

function getSource(file, filename, paths) {
    var data, header, body, src;

    data = file.split(END_MARKER);
    header = JSON.parse(data[0] || null);
    body = data[1];

    if (!header) {
        throw(new Error(HEADER_REQUIRED));
    }

    header.name = header.name || 'index.html';

    src = {
        header:header,
        body:body,
        date:new Date(header.date || filename.split('_')[0]),
        filename:filename,
        paths:paths,
        templateFilename:paths.templatesPathName + header.template,
        template:null,
        path:paths.outputPathName + (header.path ? header.path : '/')
    };

    return src;
}

function isArticleName(str) {
    return str.search(IS_ARTICLE_NAME) === 0;
}

function formatDate(date) {
	return date.toDateString();
}

module.exports = {
    getSource:getSource,
    isArticleName:isArticleName,
    formatDate:formatDate
};