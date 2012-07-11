#!/usr/bin/env node

var blake = require('../lib/blake.js')
  , resolve = require('path').resolve

;(function () {
  var arg = process.argv.splice(2)
    , isValid = !(arg && arg.length >= 2)

  if (isValid) {
    return console.error('Usage: blake source_directory target_directory [source_file ...]');
  }
  
  var source = arg.shift()
    , target = arg.shift()
    , config = require(resolve(source, 'views', 'config.js'))
    , files = arg

  blake(source, target, config, files, function (err) {
    if (err) return console.error(err)
    console.log('OK')
  })
})()