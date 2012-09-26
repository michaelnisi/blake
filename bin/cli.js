#!/usr/bin/env node

var blake = require('../index.js')

;(function () {
  var arg = process.argv.splice(2)
    , isValid = !(arg && arg.length >= 2)

  if (isValid) {
    return console.error('Usage: blake source_directory target_directory [source_file ...]');
  }
  
  blake(arg.shift(), arg.shift(), arg)
    .on('error', function (err) { 
      console.error(err)
    })
    .on('data', function (item) {
      console.log(item.path)
    })
    .on('end', function () {
      console.log('OK')
      process.exit()
    })
})()
