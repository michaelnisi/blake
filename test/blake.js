var test = require('tap').test
var blake = require('../')

test('paths', function (t) {
  var f = blake.paths
  var args = [
    [undefined],
    [null],
    ['source'],
    ['source', 'target'],
    ['source', 'target', {}]
  ]
  args.forEach(function (arg) {
    t.throws(function () {
      f.apply(null, arg)
    })
  })
  var found = [
    f('source', 'target', { paths: {} }),
    f('source', 'target', { paths: {
      data: 'data',
      posts: 'posts',
      resources: 'resources',
      templates: 'templates'
    }})
  ]
  var wanted = [
    { data: null,
      posts: null,
      resources: null,
      target: 'target',
      templates: null
    },
    { data: 'source/data',
      posts: 'source/posts',
      resources: 'source/resources',
      target: 'target',
      templates: 'source/templates'
    }
  ]
  wanted.forEach(function (it, i) {
    t.same(it, found[i])
  })
  t.end()
})

test('header', function (t) {
  var f = blake.header
  var args = [
    [undefined],
    [null],
    [''],
    ['{}'],
    ['{"template": "template.file"}'],
    ['{"template": "template.file"}', 'file.name']
  ]
  args.forEach(function (arg) {
    t.throws(function () {
      f.apply(null, arg)
    })
  })
  f('{"template": "template.file"}', 'file.name', {})
  t.end()
})
