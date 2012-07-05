var test = require('tap').test
,   blake = require('../lib/blake.js')
,   fstream = require('fstream')

test('foundation', function (t) {
  // t.ok(writer.config, 'should be there')
  // t.ok(writer.templates, 'should be there')

  blake('source', 'target')

  t.end()
})
