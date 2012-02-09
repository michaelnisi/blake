var blake = require('./index.js');
var names = ['../input/data/about.md'];
var paths = blake.getPaths(require('./lib/config.js'), 
                           '../input', 
                           '../output');

blake.bakeFiles(names, paths, function(error) {
  console.log('OK');
});
