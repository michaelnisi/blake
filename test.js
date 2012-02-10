var blake = require('./blake.js');
var names = ['../input/data/about.md'];
var paths = blake.getPaths(require('../input/views/config.js'), 
                           '../input', 
                           '../output');

blake.bakeFiles(names, paths, function(error) {
  console.log('OK');
});
