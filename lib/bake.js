/**
 * bake.js
 */

var reader = require('./reader.js'),
    transformer = require('./transformer.js'),
    writer = require('./writer.js');

var ARTICLES_DIRNAME = 'articles',
    TEMPLATES_DIRNAME = 'templates',
    OK = 'OK » baked',
    READING_TEMPLATES = 'Reading templates...',
    READING_ARTICLES = 'Reading articles...',
    WRITING_PAGES = 'Writing pages...';

var bake = function(inputDirname, outputDirname) {
    console.time(OK);
    console.log(READING_TEMPLATES);
    reader.read(inputDirname + '/' + TEMPLATES_DIRNAME, function(templates) {
        console.log(READING_ARTICLES);
        reader.read(inputDirname + '/' + ARTICLES_DIRNAME, function(articles) {
            console.log(WRITING_PAGES);
            writer.write(transformer.transform(templates, articles, outputDirname), writeCompleteHandler);
        });
    });
};

var writeCompleteHandler = function(files) {
    console.timeEnd(OK);
}

module.exports = {
    bake:bake
};