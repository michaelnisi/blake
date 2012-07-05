var test = require('tap').test
,   blake = require('../lib/blake.js')
,   statSync = require('fs').statSync
,   resolve = require('path').resolve

test('foundation', function (t) {
  var source = 'source'
  ,   target = 'target'

  blake(source, target, function (err) {
    t.ok(statSync(resolve(target, 'index.html')).isFile())
   
    var dirs = ['css', 'img', 'js', '2011', '2012']
    dirs.forEach(function (path) {
      t.ok(statSync(resolve(target, path)).isDirectory())
    }) 
   
    t.end() 
  })
})
