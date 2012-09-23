var test = require('tap').test
  , popfun = require('../lib/popfun.js')
  , callback = function () {}

test('argument', function (t) {
  t.equals(popfun(), null, 'should be null')
  t.equals(popfun(undefined), null, 'should be null')
  t.equals(popfun(null), null, 'should be null')
  t.equals(popfun({}), null, 'should be null')
  t.equals(popfun([]), null, 'should be null')
  t.equals(popfun(true), null, 'should be null')
  t.equals(popfun(1), null, 'should be null')
  t.equals(popfun('beep'), null, 'should be null')
  t.end()
})
  
test('single', function (t) {
  var args = [callback]
  t.equals(popfun(args), callback, 'should be callback')
  t.equals(args.length, 0, 'should be popped')
  t.end()
})

test('multiple', function (t) {
  var args = [true, 1, '', {}, [], function () {}, callback]
  t.equals(popfun(args), callback, 'should be callback')
  t.equals(args.length, 6,  'should be popped')
  t.end()
})
