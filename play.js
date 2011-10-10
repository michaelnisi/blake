/**
 * play.js
 */

var fs = require('fs'),
    step = require('step');

step(
    function readSelf() {
        fs.readFile(__filename, 'utf8', this);
    },
    function capitalize(err, text) {
        if (err) throw err;
        return text.toUpperCase();
    },
    function showIt(err, newText) {
        if (err) throw err;
        console.log(newText);
    }
);