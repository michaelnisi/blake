var blake = require('blake')

blake('blake-site', '/tmp/blake-site', function (err) {
  console.log(err || 'OK')
})
