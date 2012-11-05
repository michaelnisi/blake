var test = require('tap').test
  , getItem = require('../lib/getItem.js')
  , path = require('path')
  , readFileSync = require('fs').readFileSync
  , getProps = require('../lib/getProps.js')
  , source = path.resolve('../example/blake-site')
  , target = '/tmp/blake-' + Math.floor(Math.random() * (1<<24))
  , props = getProps(source, target)

test('read', function (t) {
  var filename = path.join(props.paths.data, 'index.md')
    , file = readFileSync(filename)
  
  var header = {
    template: 'index.jade'
  , name: 'index.html'
  , date: new Date()
  , path: undefined
  }

  var item = getItem(props, filename, file.toString())

  t.deepEqual(item.header, header, 'should be expected header')
  t.ok(item.body, 'should have a body')
  t.equal(item.path, target + '/index.html', 'should be correct path')
  
  t.end()
})
