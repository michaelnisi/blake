/**
 * data.js
 */

var rss = require('./rss'),
    articles = require('./articles');

var END_MARKER = '%END';

exports.getHeader = function(str) {
    return JSON.parse(str.split(END_MARKER)[0]);
};

exports.getBody = function(str) {
    return str.split(END_MARKER)[1];
};

exports.generatorsByTemplate = {
    'rss.jade':rss.bake,
    'article.jade':articles.bake
};