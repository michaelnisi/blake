#!/usr/bin/env node

var blake = require('../index.js')
  , cop = require('cop')
  , filenames = require('../lib/read.js').fstream
  , copy = require('../lib/copy.js')
  , join = require('path').join

;(function () {
  var arg = process.argv.splice(2)
    , isValid = arg && arg.length >= 2

  if (!isValid) {
    return console.error('Usage: blake source_directory target_directory [source_file ...]');
  }

  var source = arg.shift()
    , target = arg.shift()

  function bake () {
    filenames(source, arg)
      .pipe(cop('path'))
      .pipe(blake(source, target))
      .pipe(cop(function (filename) { return filename + '\n' }))
      .pipe(process.stdout)
  }

  if (!arg.length) {
    copy(join(source, 'resources'), target)
      .on('error', console.error)
      .on('end', bake)
      .pipe(process.stdout)
  } else {
    bake()
  }
})()

