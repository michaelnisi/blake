#!/usr/bin/env node

var blake = require('../lib/blake.js')

;(function () {
  var arg = process.argv.splice(2)
    , isValid = !(arg && arg.length >= 2)

  if (isValid) {
    return console.error('Usage: blake source_directory target_directory [source_file ...]');
  }
  
  blake(arg.shift(), arg.shift(), arg, function (err) {
    if (err) return console.error(err)
    console.log('OK')
    process.exit()
  }).on('item', function (item) {
    console.log(item.path)
  })
})()
