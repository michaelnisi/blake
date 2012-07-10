var test = require('tap').test
,   resolve = require('path').resolve
,   getPaths = require('../lib/paths.js')

test('paths', function (t) {
  var source = 'source'
  ,   target = 'target'
  ,   config = require(resolve(source, 'views', 'config.js')) 
  ,   paths = getPaths(source, target, config)
  
  var expected = {
    target: 'target'
  , resources: 'source/resources'
  , data: 'source/data'
  , templates: 'source/templates'
  , posts: 'source/data/posts'
  }

  t.deepEqual(paths, expected, 'should be equal')
  t.end()
})

