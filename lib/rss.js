/**
 * rss.js
 */

var step = require('step'),
    jade = require('jade'),
    fs = require('fs'),
    getHeader = require('./transformer.js').getHeader;

var getItem = function(filename, data) {
    var date = filename.substr(0, filename.indexOf('_'));
    var header = getHeader(data);

    return  {
        title:header.title,
        description:header.summary,
        link:header.path,
        date:new Date(date).toGMTString()
    };
};

var addItem = function(filename, items, callback) {
    console.log('Read ' + filename);
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        items.push(getItem(filename, data));
        callback(err, items);
    });
};

/**
 *
 * @param filename
 * @param dir
 * @param target
 * @param callback
 */
exports.bake = function(filename, dir, target, callback) {
    var result, rss;
    var items = [];

    step(
        function() {
            console.log('Read ' + filename);
            fs.readFile(filename, 'utf8', this.parallel());
            fs.readdir(dir, this.parallel());
        },
        function(err, data, names) {
            if (err) {
                throw err;
            }
            rss = jade.compile(data, { filename:filename, pretty:true });
            var group = this.group();
            names.forEach(function(name) {
                addItem(dir + '/' + name, items, group());
            });
        },
        function(err, files) {
            if (err) {
                throw err;
            }
            result = rss({ items:items, channel:{ date:new Date().toGMTString() } });
            var filename = target + '/rss.xml';
            console.log('Write ' + filename);
            fs.writeFile(filename, result, this);
        },
        function(err) {
            callback(err, true);
        }
    );
};