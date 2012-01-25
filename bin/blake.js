#!/usr/bin/env node

(function () {
  var arg, isUsageIncorrect, ok;

  arg = process.argv.splice(2);
  isUsageIncorrect = !(arg && arg.length === 2);

  if (isUsageIncorrect) {
    console.error('Usage: blake path/to/input path/to/output');
    return;
  }

  ok = 'OK » baked';

  console.time(ok);

  require('../index.js').bake(arg[0], arg[1], function (err) {
    if (err) {
      throw err;
    }

    console.timeEnd(ok);
    process.exit();
  });
})();
