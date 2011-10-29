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
 * transformer.js
 */

var jade = require('jade'),
    markdown = require('markdown').markdown,
    highlight = require('highlight').Highlight;


var END = '%END';

var templatesByName;

var transform = function(templates, articles, outputDirname) {
    mapTemplates(templates);

    var pages = [];

    var article;
    var i = articles.length;
    while (i--) {
        article = articles[i];
        pages.push(getPage(article, outputDirname));
    }

    return pages;
}

var mapTemplates = function(templates) {
    templatesByName = {};

    var template;
    var i = templates.length;
    while (i--) {
        template = templates[i];
        templatesByName[template.name] = template;
    }
}

var getHeader = function(str) {
    return JSON.toJSON(str);
}

var getPage = function(a, outputDirname) {
    var parts = a.data.split(END);
    var header = getHeader(parts[0]);
    var page = parts[1];

    var article = new Article(a.name, header.template, page);

    var template = templatesByName[article.template];
    var articleHTML = markdown.toHTML(article.data);
    var toHTML = getJadeCompile(template.data, template.path);
    var html = toHTML({ article:articleHTML });
    var output = highlightHTML(html);

    return new File(a.name, outputDirname + '/' + header.name + '.html', output);
}

var getJadeCompile = function(str, filename) {
    return jade.compile(str, { filename:filename  });
};

var highlightHTML = function(html) {
    return html.replace(/<pre><code>[^<]+<\/code><\/pre>/g,
        function applyHighlight(code) {
            var code = code.match(/<code>([\s\S]+)<\/code>/)[1];
            code = highlight(code);
            return "<pre><code>" + code + "</code></pre>";
        }
    );
};

module.exports = {
    transform:transform,
    getHeader:getHeader
};

