#!/usr/bin/env node

var blake = require('../index')
  , cop = require('cop')
  , files = require('../lib/read').fstream
  , copy = require('../lib/copy')
  , join = require('path').join

;(function () {
  var arg = process.argv.splice(2)
    , isValid = arg && arg.length >= 2

  if (!isValid) {
    return console.error('Usage: blake source_directory target_directory [source_file ...]');
  }

  var source = arg.shift()
    , target = arg.shift()

  if (!arg.length) {
    copy(join(source, 'resources'), target)
      .on('error', console.error)
      .on('end', bake)
      .pipe(process.stdout)
  } else {
    bake()
  }

  function bake () {
    files(source, arg)
      .pipe(cop('path'))
      .pipe(blake(source, target))
      .pipe(cop(format))
      .pipe(process.stdout)
  }
})()

function format (str) {
  return str += '\n'
}

