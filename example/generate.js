// This module generates the Blake site.

var bake = require('blake').bake;

var ok = 'OK';

console.time(ok);

bake('blake-site', '/tmp/blake-site', function (err) {
  if (err) throw(err);
  console.timeEnd(ok); 
});
