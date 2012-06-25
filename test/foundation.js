var test = require('tap').test
,   blake = require('../lib/blake.js')
,   fstream = require('fstream')

test('foundation', function (t) {
  var r = fstream.Reader('source')
  ,   w = fstream.Writer({ path:'target', type:'Directory'})
  ,   b = blake('source')

  t.ok(b.config, 'should be there')
  t.ok(b.templates, 'should be there')

  r.pipe(b).pipe(w)

  t.end()
})
