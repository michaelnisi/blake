var test = require('tap').test
  , getItem = require('../lib/getItem.js')
  , readFileSync = require('fs').readFileSync
  , props = require('./props.js')
  , config = props.config
  , paths = config.paths
  , target = paths.target

test('read', function (t) {
  var filename = 'source/data/about.md'
    , file = readFileSync(filename)
  
  var header = {
    title: 'About The Troubled Programmer'
  , template: 'about.jade'
  , date: new Date('2012-04-08')
  , name: 'about.html'
  , path: undefined
  }

  var item = getItem(config, filename, file.toString())

  t.deepEqual(item.header, header, 'should be expected header')
  t.ok(item.body, 'should have a body')
  t.equal(item.path, target + '/about.html', 'should be correct path')
  t.equal(item.title, header.title, 'should be header title')
  
  t.end()
})

test('article', function (t) {
  var filename = 'source/data/posts/2012/double-negative.md'
  ,   file = readFileSync(filename)
  ,   item = getItem(config, filename, file.toString())
  ,   link = '2012/05/double-negative.html'
  ,   path = target + '/2012/05/double-negative.html'

  t.equal(item.link, link, 'should be correct link')
  t.equal(item.path, path, 'should be correct path')
  
  t.end()
})
