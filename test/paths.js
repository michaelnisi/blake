var test = require('tap').test
  , resolve = require('path').resolve

test('paths', function (t) {
  var source = 'source'
    , target = 'target'
    , config = require(resolve(source, 'config.js')) 
    , paths = require('../lib/paths.js')(source, target, config)
    , pathz = require('../lib/paths.js')(source, target, config)
  
  var expected = {
    target: 'target'
  , resources: 'source/resources'
  , data: 'source/data'
  , templates: 'source/templates'
  , posts: 'source/data/posts'
  }

  t.deepEqual(paths, expected, 'should be equal')
  t.same(paths, pathz, 'should be same')
  t.end()
})

