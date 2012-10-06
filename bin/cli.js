#!/usr/bin/env node

var blake = require('../index.js')
  , cop = require('cop')
  , getReader = require('../lib/getReader.js')

;(function () {
  var arg = process.argv.splice(2)
    , isValid = !(arg && arg.length >= 2)

  if (isValid) {
    return console.error('Usage: blake source_directory target_directory [source_file ...]');
  }

  var source = arg.shift()
    , target = arg.shift()
    , reader = getReader(source, arg)

  reader
    .pipe(cop('path'))
    .pipe(blake(source, target))
    .pipe(cop(function (filename) { return filename + '\n' }))
    .pipe(process.stdout)
})()

