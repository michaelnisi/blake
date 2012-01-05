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

var path = path = require('path');

var END_MARKER = '$end';
var HTML = 'html';
var DOT = '.';

function getPaths(config, inputPathName, outputPathName) {
    inputPathName = inputPathName || '/';
    outputPathName = outputPathName || '/';

    return {
        outputPathName: outputPathName,
        pathToResources: path.join(inputPathName, config.paths.resources),
        pathToData: path.join(inputPathName, config.paths.data),
        templatesPathName: path.join(inputPathName, config.paths.templates),
        posts: path.join(inputPathName, config.paths.posts)
    }
}

function getSource(file, filename, paths) {
	console.log(filename);
    var data, header, body, src, input, output;

    data = file.split(END_MARKER);
    header = JSON.parse(data[0] || null);
    body = data[1];

    if (!header) {
        throw(new Error('Header required.'));
    }

    if (!header.template) {
        throw(new Error('Template name required.'));
    }

    header.name = header.name || path.basename(filename).split(DOT)[0] + DOT + HTML;
    header.date = header.date ? new Date(header.date) : new Date();

    src = {
        header: header,
        body: body,
        paths: paths,
        filename: filename,
        date: header.date,
        templatePath: path.join(paths.templatesPathName, header.template),
        path: path.join(paths.outputPathName, (header.path ? header.path : '/')),
        name: header.name,
        link: path.join(header.path, header.name.split(DOT)[0]),
        dateString: formatDate(header.date)
    };

    return src;
}

function formatDate(date) {
    return date.toDateString();
}

module.exports = {
    getPaths: getPaths,
    getSource: getSource,
    formatDate: formatDate
};
