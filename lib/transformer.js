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

