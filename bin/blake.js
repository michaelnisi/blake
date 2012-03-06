#!/usr/bin/env node

// Receive and validate command line arguments. If the usage is not 
// correct, exit with a usage prompt; otherwise call bake with the provided
// paths to the input and output directories. Exit the process when done.
// Please consider that the output directory is deleted if it already 
// exists and created if it doesn't exist.
(function() {
  var arg, isUsageIncorrect, ok;

  arg = process.argv.splice(2);
  isUsageIncorrect = !(arg && arg.length >= 2);

  if (isUsageIncorrect) {
    return console.error('Usage: blake path/to/input path/to/output [path/to/input/file …]');
  }

  ok = 'OK » baked';

  console.time(ok);

  require('../blake.js').bake(arg, function(err) {
    if (err) {
      throw err;
    }

    console.timeEnd(ok);
    process.exit();
  });
})();
