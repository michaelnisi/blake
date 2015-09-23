#!/usr/bin/env node

var blake = require('../index')
var cop = require('cop')
var fs = require('fs')
var path = require('path')

;(function () {
  var arg = process.argv.splice(2)
  if (!arg.length) {
    return console.error('Usage: blake [source_directory] target_directory [source_file ...]')
  }
  var cwd = process.cwd()
  function isFile () {
    var p = path.resolve(cwd, arg[1])
    return fs.statSync(p).isFile()
  }
  var sansSource = arg.length === 1 || isFile()
  if (sansSource) {
    arg.unshift(cwd)
  }
  var source = arg.shift()
  var target = arg.shift()
  function onerror (er) {
    console.error(er.message)
  }
  var b = blake(source, target)
  if (!arg.length) {
    blake.copy(b.resources, target)
      .on('error', onerror)
      .on('end', bake)
      .pipe(process.stdout)
  } else {
    bake()
  }
  function bake () {
    var p = arg instanceof Array && arg.length ? arg : b.data
    blake.files(p)
      .pipe(b)
      .on('error', onerror)
      .pipe(cop(function (str) { return str + '\n' }))
      .pipe(process.stdout)
  }
})()
