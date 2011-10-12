/**
 * bake.js
 */

var transformer = require('./transformer'),
    fs = require('fs'),
    step = require('step'),
    data = require('./data');

var OK = 'OK » baked';

var compile = function(filename, pathToTemplates, callback) {
    console.log('Read %s', filename);

    var header, body;

    step(
        function() {
            fs.readFile(filename, 'utf8', this);
        },
        function(err, file) {
            if (err) {
                throw err;
            }

            header = data.getHeader(file);
            body = data.getBody(file);

            fs.readFile(pathToTemplates + header.template, 'utf8', this);
        },
        function(err, template) {
            if (err) {
                throw err;
            }

            data.generatorsByTemplate[header.template]();

            callback(err);
        }
    );
};

var bake = function(input, output, callback) {
    var pathToData = input + '/data/';
    var pathToTemplates  = input + '/templates/';

    step(
        function() {
            fs.readdir(pathToData, this);
        },
        function(err, names) {
            if (err) {
                throw err;
            }

            var group = this.group();
            names.forEach(function(name) {
                compile(pathToData + name, pathToTemplates, group());
            });
        },
        function(err) {
            callback(err, true);
        }
    );
}

exports.main = function(arg) {
    if (!arg || arg.length < 2) {
        console.error('Usage: node bake path/to/input path/to/output');
        return -1;
    }

    var input = arg[0];
    var output = arg[1];

    bake(input, output, function(err) {
    });

    return 0;
};