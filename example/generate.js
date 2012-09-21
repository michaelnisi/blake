var blake = require('blake')

blake('blake-site', '/tmp/blake-site')
  .on('data', function (item) {
    console.log(item)
  })
  .on('error', function (err) {
    console.error(err)
  })
  .on('end', function () {
    console.log('OK')
  })
