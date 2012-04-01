#!/usr/bin/env node

// This is the CLI-wrapper of Blake.

// Receive and validate command-line arguments. If usage is incorrect, exit
// with a usage prompt; otherwise call bake with the provided paths to the 
// input and output directories. Exit the process when done. 
(function() {
  var arg = process.argv.splice(2);
  var isUsageIncorrect = !(arg && arg.length >= 2);

  if (isUsageIncorrect) {
    return console.error('Usage: blake path/to/input path/to/output [path/to/input/file …]');
  }

  var ok = '\u001b[32mOK\u001b[39m';

  console.time(ok);

  require('../lib/blake.js').bake(arg, function(err) {
    if (err) {
      throw err;
    }

    console.timeEnd(ok);
    process.exit();
  });
})();
